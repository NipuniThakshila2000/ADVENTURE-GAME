import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer } from "node:http";
import pg from "pg";
import { allowedMembers } from "./allowedMembers.js";

const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.AUTH_SECRET ?? "change-this-secret-before-production";
const databaseUrl = process.env.DATABASE_URL;
const rootDir = resolve(process.cwd());
const distDir = join(rootDir, "dist");
const useSsl = process.env.DATABASE_SSL === "true" || process.env.NODE_ENV === "production";
const pool = databaseUrl
  ? new pg.Pool({
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;
let initPromise = null;
const allowedMembersByEmail = new Map(allowedMembers.map((member) => [normalizeEmail(member.email), member]));

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function initDatabase() {
  if (!pool) {
    throw new Error("DATABASE_URL is required. Set it to your PostgreSQL connection string.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_saves (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      game_state JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function ensureDatabaseReady() {
  initPromise ??= initDatabase();
  await initPromise;
}

async function getUserById(userId) {
  if (!pool || !userId) return null;
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [userId],
  );
  return result.rows[0] ?? null;
}

async function getUserByEmail(email) {
  if (!pool) return null;
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE email = $1",
    [email],
  );
  return result.rows[0] ?? null;
}

async function createUser({ name, email }) {
  if (!pool) throw new Error("Database is not configured.");
  const userId = randomBytes(16).toString("hex");
  const result = await pool.query(
    `INSERT INTO users (id, name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email`,
    [userId, name, email, "allowlist"],
  );
  await pool.query("INSERT INTO game_saves (user_id, game_state) VALUES ($1, $2)", [userId, null]);
  return result.rows[0];
}

async function getSavedGame(userId) {
  if (!pool) throw new Error("Database is not configured.");
  const result = await pool.query("SELECT game_state AS \"gameState\" FROM game_saves WHERE user_id = $1", [userId]);
  return result.rows[0]?.gameState ?? null;
}

async function upsertSavedGame(userId, gameState) {
  if (!pool) throw new Error("Database is not configured.");
  await pool.query(
    `INSERT INTO game_saves (user_id, game_state, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET game_state = EXCLUDED.game_state, updated_at = NOW()`,
    [userId, gameState ?? null],
  );
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        request.destroy();
        rejectBody(new Error("Request body is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
      } catch {
        rejectBody(new Error("Invalid JSON body."));
      }
    });
  });
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function signToken(userId) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ sub: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }));
  const signature = createHmac("sha256", jwtSecret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function getUserIdFromRequest(request) {
  const authHeader = request.headers.authorization ?? "";
  const [, token] = authHeader.match(/^Bearer (.+)$/) ?? [];
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expectedSignature = createHmac("sha256", jwtSecret).update(`${header}.${payload}`).digest("base64url");
  if (signature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.sub || Date.now() > Number(data.exp)) return null;
    return data.sub;
  } catch {
    return null;
  }
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function requireUser(request, response) {
  const userId = getUserIdFromRequest(request);
  const user = await getUserById(userId);
  if (!user) {
    sendJson(response, 401, { error: "Please sign in again." });
    return null;
  }
  return { user };
}

async function handleApi(request, response) {
  try {
    await ensureDatabaseReady();

    if (request.method === "POST" && request.url === "/api/auth/login") {
      const body = await readJson(request);
      const email = normalizeEmail(body.email);
      if (!isValidEmail(email)) return sendJson(response, 400, { error: "Enter a valid email address." });

      const allowedMember = allowedMembersByEmail.get(email);
      if (!allowedMember) {
        return sendJson(response, 403, { error: "This email is not approved for member access.", code: "member_not_found" });
      }

      const user = (await getUserByEmail(email)) ?? (await createUser({ name: allowedMember.name || email, email }));
      return sendJson(response, 200, { token: signToken(user.id), user: publicUser(user) });
    }

    if (request.method === "GET" && request.url === "/api/auth/me") {
      const context = await requireUser(request, response);
      if (!context) return;
      return sendJson(response, 200, { user: publicUser(context.user) });
    }

    if (request.method === "GET" && request.url === "/api/save") {
      const context = await requireUser(request, response);
      if (!context) return;
      const gameState = await getSavedGame(context.user.id);
      return sendJson(response, 200, { gameState });
    }

    if (request.method === "PUT" && request.url === "/api/save") {
      const context = await requireUser(request, response);
      if (!context) return;
      const body = await readJson(request);
      await upsertSavedGame(context.user.id, body.gameState ?? null);
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === "DELETE" && request.url === "/api/save") {
      const context = await requireUser(request, response);
      if (!context) return;
      await upsertSavedGame(context.user.id, null);
      return sendJson(response, 200, { ok: true });
    }

    sendJson(response, 404, { error: "API route not found." });
  } catch (error) {
    sendJson(response, 400, { error: error instanceof Error ? error.message : "Request failed." });
  }
}

function serveStatic(request, response) {
  const requestPath = new URL(request.url ?? "/", `http://${request.headers.host}`).pathname;
  const filePath = requestPath === "/" ? join(distDir, "index.html") : join(distDir, requestPath);
  const resolvedPath = resolve(filePath);
  const finalPath = existsSync(resolvedPath) && resolvedPath.startsWith(distDir) ? resolvedPath : join(distDir, "index.html");

  if (!existsSync(finalPath)) {
    response.writeHead(404, jsonHeaders);
    response.end(JSON.stringify({ error: "Build the frontend with npm run build before using npm start." }));
    return;
  }

  response.writeHead(200, { "content-type": mimeTypes[extname(finalPath)] ?? "application/octet-stream" });
  createReadStream(finalPath).pipe(response);
}

export function handleRequest(request, response) {
  if ((request.url ?? "").startsWith("/api/")) {
    void handleApi(request, response);
    return;
  }
  serveStatic(request, response);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await ensureDatabaseReady();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Database initialization failed.");
    process.exit(1);
  }

  createServer(handleRequest).listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
  });
}

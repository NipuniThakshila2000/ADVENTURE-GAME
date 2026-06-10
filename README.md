# CMS Redux Trail: The Tohu Journey

A complete browser game built with Vite, React, and TypeScript. It is an educational choose-your-adventure memory companion for CMS Redux Module 1 course recall.

## Run locally

```bash
npm install
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
$env:AUTH_SECRET="replace-with-a-long-random-secret"
npm run server
```

In a second terminal:

```bash
npm run dev
```

On this Windows machine, PowerShell may block `npm.ps1`. If that happens, use:

```bash
npm.cmd install
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
$env:AUTH_SECRET="replace-with-a-long-random-secret"
npm.cmd run server
npm.cmd run dev
```

Open the Vite URL shown by `npm run dev`. The frontend proxies `/api` requests to the auth server on `http://localhost:3001`.

## Authentication and database

The app now includes a Node auth server backed by PostgreSQL. Set `DATABASE_URL` before starting the server. The server creates the required tables automatically on startup.

- Users sign in with email only.
- Access is limited to the member email allowlist in the configured Google Sheet.
- Approved members are created automatically on first sign-in.
- Newly added Google Sheet emails are picked up automatically after the member list refresh interval.
- Signed bearer tokens keep users authenticated.
- Each user's journey progress is saved through `/api/save`.
- User account data is stored in the `users` table.
- Saved game progress is stored as JSONB in the `game_saves` table.

You can use any hosted PostgreSQL provider, including Neon, Supabase, Railway, or Render. Copy the provider's PostgreSQL connection string and set it as `DATABASE_URL`.

Required environment variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="replace-with-a-long-random-secret"
GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0"
```

If your hosted PostgreSQL provider requires SSL, set:

```bash
DATABASE_SSL="true"
```

The Google Sheet must be accessible to the server as a CSV export. In Google Sheets, use **File > Share > Publish to web** and publish the member tab as CSV, or use the export URL above with the correct `SHEET_ID` and `gid`. The sheet should have an `Email` column; an optional `Name` column will be used for the displayed user name. The server refreshes the sheet every 60 seconds by default. To change that, set:

```bash
MEMBER_REFRESH_MS="30000"
```

In production, `GOOGLE_SHEET_CSV_URL` is required. The old generated allowlist file is only used as a local development fallback when the sheet URL is not set.

For production, build the frontend and run the same Node server:

```bash
npm run build
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE" \
AUTH_SECRET="replace-with-a-long-random-secret" npm start
```

On Windows PowerShell:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
$env:AUTH_SECRET="replace-with-a-long-random-secret"
npm.cmd start
```

## Structure

- `src/data/gameData.ts` contains stations, choices, quizzes, random events, course notes, and endings.
- `src/data/gameEngine.ts` contains resource clamping, save/load, event selection, quiz handling, scoring, and ending selection.
- `src/api/auth.ts` contains the browser API client for authentication and saved games.
- `src/components` contains the required UI components.
- `server/index.js` contains the auth API, PostgreSQL database handling, and production static file server.
- `public/images` is reserved for generated scene images.
- `IMAGE_PROMPTS.md` contains the image prompts for the gallery assets.

## Disclaimer

This game is a learning companion for course recall, not medical, psychological, or spiritual direction.
# ADVENTURE-GAME

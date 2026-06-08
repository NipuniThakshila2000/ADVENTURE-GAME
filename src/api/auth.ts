import type { GameState } from "../types/game";

const tokenKey = "cms-redux-auth-token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function getAuthToken() {
  return localStorage.getItem(tokenKey);
}

export function setAuthToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

export function clearAuthToken() {
  localStorage.removeItem(tokenKey);
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Request failed.");
  return payload as T;
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const result = await requestJson<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAuthToken(result.token);
  return result.user;
}

export async function loginUser(input: { email: string; password: string }) {
  const result = await requestJson<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAuthToken(result.token);
  return result.user;
}

export async function getCurrentUser() {
  const result = await requestJson<{ user: AuthUser }>("/api/auth/me");
  return result.user;
}

export async function getRemoteSave() {
  const result = await requestJson<{ gameState: GameState | null }>("/api/save");
  return result.gameState;
}

export async function saveRemoteGame(gameState: GameState) {
  await requestJson<{ ok: true }>("/api/save", {
    method: "PUT",
    body: JSON.stringify({ gameState }),
  });
}

export async function clearRemoteGame() {
  await requestJson<{ ok: true }>("/api/save", { method: "DELETE" });
}

//
// REST API integration helpers for backend endpoints
//
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"; // or from .env

function authHeader(token: string | null): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// PUBLIC_INTERFACE
export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiRegister(username: string, password: string) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || "Register failed");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiMe(token: string): Promise<{ username: string, score: number }> {
  const headers = authHeader(token);
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    ...(headers ? { headers } : {})
  });
  if (!res.ok) throw new Error("Invalid user");
  return await res.json();
}

type GameBoardCell = "X" | "O" | null;
export type GameData = {
  id: string;
  board: GameBoardCell[][];
  active: boolean;
  winner: "X" | "O" | "Tie" | null;
  playerSymbol: "X" | "O";
  winnerLine?: [number, number][];
};
export type GameHistory = {
  id: string;
  result: string;
  opponent: string;
  createdAt?: string;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  rank?: number;
};


// PUBLIC_INTERFACE
export async function apiStartGame(token: string, vsAI: boolean = false): Promise<GameData> {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: {
      ...authHeader(token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ vsAI })
  });
  if (!res.ok) throw new Error("Failed to start game");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiGetGame(gameId: string, token?: string): Promise<GameData> {
  const headers = token ? authHeader(token) : undefined;
  const res = await fetch(`${API_BASE}/games/${gameId}`, {
    method: "GET",
    ...(headers ? { headers } : {})
  });
  if (!res.ok) throw new Error("Cannot fetch game");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiMove(token: string, gameId: string, i: number, j: number): Promise<GameData> {
  const res = await fetch(`${API_BASE}/games/${gameId}/move`, {
    method: "POST",
    headers: {
      ...authHeader(token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ i, j })
  });
  if (!res.ok) {
    let msg = "Failed to make move";
    try { msg = (await res.json()).message; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiGetUserGames(username: string, token: string): Promise<GameHistory[]> {
  const headers = authHeader(token);
  const res = await fetch(`${API_BASE}/games/user/${username}`, {
    method: "GET",
    ...(headers ? { headers } : {})
  });
  if (!res.ok) throw new Error("Failed to fetch user games");
  const games = await res.json();
  return games;
}

// PUBLIC_INTERFACE
export async function apiGetLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return await res.json();
}

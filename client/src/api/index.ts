import ky from "ky";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export async function get<T>(path: string): Promise<ApiResponse<T>> {
  return await ky.get(path, { prefixUrl: "/api" }).json<ApiResponse<T>>();
}
export async function post<T>(
  path: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return await ky
    .post(path, { prefixUrl: "/api", json: data })
    .json<ApiResponse<T>>();
}

export async function getLoginUrl(): Promise<string> {
  const res = await get<{ url: string }>("login-url");
  return res.data.url;
}

export async function logout() {
  return await post("logout");
}

interface User {
  name: string;
  avatar: string;
}
export async function getUser(): Promise<User | null> {
  try {
    const res = await get<User>("me");
    return res.data;
  } catch (e) {
    return null;
  }
}

export async function next(): Promise<void> {
  await post("next");
}
export async function hangup(): Promise<void> {
  await post("hangup");
}
export async function info(): Promise<void> {
  await post("info");
}

export async function recordAnswer(
  qNum: number,
  teamNum: number,
  teamName: string
): Promise<void> {
  await post("record-answer", { qNum, teamNum, teamName });
}

export function openWebSocket() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  return new WebSocket(`${protocol}://${location.host}`);
}

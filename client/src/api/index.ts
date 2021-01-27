import ky from "ky";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export async function get<T>(path: string): Promise<ApiResponse<T>> {
  return await ky.get(path, { prefixUrl: "/api" }).json<ApiResponse<T>>();
}

export async function getLoginUrl(): Promise<string> {
  const res = await get<{ url: string }>("login-url");
  return res.data.url;
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

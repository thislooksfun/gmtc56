import got from "got";
import { URLSearchParams } from "url";
import { AnyObject } from "./any-object.js";

const apiUrlPrefix = "https://discord.com/api/v8";

const clientID = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
const redirectUri = process.env.DISCORD_REDIRECT_URI;
const authScopes = ["identify"].join(" ");

export interface Auth {
  token: string;
  refreshToken: string;
  scopes: string;
}

interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface User {
  avatar: string;
  discriminator: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  public_flags: number;
  username: string;
}

export function getLoginUrl(): String {
  const params = {
    client_id: clientID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: authScopes,
  };
  const str = new URLSearchParams(params).toString();
  return `${apiUrlPrefix}/oauth2/authorize?${str}`;
}

function headers(token?: string): AnyObject {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

async function apiGet<T>(
  path: string,
  query: AnyObject = {},
  token?: string
): Promise<T> {
  return got
    .get(path, {
      prefixUrl: apiUrlPrefix,
      searchParams: query,
      headers: headers(token),
    })
    .json<T>();
}

async function apiPost<T>(
  path: string,
  data: AnyObject = {},
  token?: string
): Promise<T> {
  return got
    .post(path, {
      prefixUrl: apiUrlPrefix,
      form: data,
      headers: headers(token),
    })
    .json<T>();
}

export async function auth(code: string): Promise<{ auth: Auth; user: User }> {
  const data = {
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    scope: authScopes,
  };
  const auth: AuthResponse = await apiPost("oauth2/token", data);
  if (auth.token_type !== "Bearer") {
    throw new Error(
      `Authentication returned invalid token type ${auth.token_type}`
    );
  }

  const user = await getMe(auth.access_token);

  return {
    auth: {
      token: auth.access_token,
      refreshToken: auth.refresh_token,
      scopes: auth.scope,
    },
    user,
  };
}

export async function getMe(token: string): Promise<User> {
  return apiGet("users/@me", {}, token);
}

export function getAvatarUrl(user: User) {
  const type = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=4096`;
}

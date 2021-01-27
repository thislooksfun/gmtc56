import Discord from "discord.js";

const client = new Discord.Client();
const ipcChannelId = "803461225266151484";

export async function login(token?: string) {
  if (!token) throw new Error("Missing login token");
  return client.login(token);
}

export async function ipcChannel(): Promise<Discord.TextChannel> {
  const channel = await client.channels.fetch(ipcChannelId);
  return channel as Discord.TextChannel;
}

export async function msgOperator(msg: string) {
  (await ipcChannel()).send(msg);
}

export async function next(userid: string) {
  await msgOperator(`!su next ${userid}`);
}

export async function hangup(userid: string) {
  await msgOperator(`!su hup ${userid}`);
}

export function close() {
  client.destroy();
}

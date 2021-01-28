import Discord from "discord.js";
import socket from "./socket.js";

const client = new Discord.Client();
const ipcChannelId = "803461225266151484";
const operatorId = "799855360571736105";

export async function login(token?: string) {
  if (!token) throw new Error("Missing login token");
  await client.login(token);
  client.on("message", handleMessage);
}

interface SuReply {
  src: {
    id: string;
    cmd: string;
  };
  userid: string;
  msg: any;
}
interface SimpleUser {
  name: string;
  id: string;
  avatarUrl?: string;
}
interface TMMessage {
  channel: {
    name: string;
    id: string;
  };
  author: SimpleUser;
  id: string;
  at: number;
  content: string;
}
interface PhoneState {
  user: SimpleUser;
  connected: string[];
}

function handleMessage({ author, content }: Discord.Message) {
  if (author.id !== operatorId) return;

  console.log(`Got message from operator: ${content}`);
  try {
    const msg = JSON.parse(content);
    if (msg.event) {
      handleEvent(msg.event, msg.data);
    } else if (msg.userid) {
      handleSuReply(msg);
    } else {
      console.log(`Unknown message type ${content}`);
    }
  } catch (e) {
    console.log(`Unable to parse message from operator: '${content}'`);
  }
}

function handleSuReply(reply: SuReply) {
  if (reply.src.cmd === "info" && !reply.msg.isPA) {
    socket.send(reply.userid, "unauthorized", null);
  } else {
    socket.send(reply.userid, "su-reply", {
      to: reply.src.cmd,
      msg: reply.msg,
    });
  }
}

function handleEvent(event: string, data: any) {
  switch (event) {
    case "tm-message":
      const tmMsg: TMMessage = data;
      const msg = {
        id: tmMsg.id,
        timestamp: tmMsg.at,
        channel: tmMsg.channel.name,
        author: tmMsg.author.name,
        msg: tmMsg.content,
      };
      socket.sendAll("tm-message", msg);
      break;
    case "phone-connected":
    case "phone-disconnected":
      const state: PhoneState = data;
      // Dedupe the ids
      const ids = [...new Set([state.user.id, ...state.connected])];
      ids.forEach(id => socket.send(id, event, state.user));
      break;
    default:
      console.log(`Unknown operator event: ${event} (data: ${data})`);
  }
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

export async function info(userid: string) {
  await msgOperator(`!su info ${userid}`);
}

export function close() {
  client.destroy();
}

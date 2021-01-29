import { Server } from "http";
import { RequestHandler } from "express";
import WebSocket from "ws";

let wss: WebSocket.Server;
const sockets = new Map<string, WebSocket & Living>();

interface Living {
  alive?: boolean;
}

function heartbeat() {
  sockets.forEach(ws => {
    if (!ws.alive) return ws.terminate();
    ws.alive = false;
    ws.ping();
  });
}
const pingInterval = setInterval(heartbeat, 20000);

export function init(server: Server, sessionParser: RequestHandler) {
  if (wss != null) {
    throw new Error("WebSocket Server already initalized!");
  }

  wss = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("upgrade", function(request, socket, head) {
    // @ts-ignore
    sessionParser(request, {}, () => {
      if (!request.session.auth) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function(ws) {
        wss.emit("connection", ws, request);
      });
    });
  });

  wss.on("connection", (ws: WebSocket & Living, req) => {
    console.log(`Opening websocket...`);

    // @ts-ignore ;; Tie the socket to the user id for later access.
    const userid: string = req.session.user!.id;

    const old = sockets.get(userid);
    if (old) {
      console.log(`Closing old websocket for user ${userid}`);
      old.send("exit");
      old.emit("offclose");
      old.close();
    }

    // Handle websocket lifecycle.
    sockets.set(userid, ws);

    const onClose = () => {
      console.log(`Websocket for user ${userid} closed`);
      sockets.delete(userid);
    };

    const onMsg = (msg: WebSocket.Data) => {
      console.log(`Got msg '${msg}'`);
      ws.send("Hello");
    };

    ws.alive = true;
    ws.on("pong", () => (ws.alive = true));
    ws.on("close", onClose);
    ws.on("offclose", () => ws.off("close", onClose));
    ws.on("message", onMsg);

    // TODO: Get startup status.
    console.log(`Opened websocket connection to user ${userid}`);
  });

  wss.on("close", () => clearInterval(pingInterval));
}

function close(userid: string) {
  const ws = sockets.get(userid);
  if (ws) {
    ws.send("exit");
    ws.close();
  }
}

function closeServer() {
  wss.close();
  sockets.forEach(ws => {
    ws.send("exit");
    ws.close();
  });
}

function send(userid: string, type: string, data: any) {
  const ws = sockets.get(userid);
  if (ws) ws.send(JSON.stringify({ type, data }));
}

function sendAll(type: string, data: any) {
  sockets.forEach(ws => ws.send(JSON.stringify({ type, data })));
}

export default {
  init,
  close,
  closeServer,
  send,
  sendAll,
};

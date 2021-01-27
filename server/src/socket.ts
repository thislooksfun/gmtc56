import { Server } from "http";
import { RequestHandler } from "express";
import WebSocket from "ws";

let wss: WebSocket.Server;
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

  wss.on("connection", ws => {
    // TODO: Get startup status.
    console.log("Got websocket connection!");

    ws.on("message", msg => {
      console.log(`Got msg '${msg}'`);
      ws.send("Hello");
    });
  });
}

export default {
  init,
};

import { Server } from "http";
import { RequestHandler } from "express";
import WebSocket from "ws";

let wss: WebSocket.Server;
export function init(server: Server, sessionParser: RequestHandler) {
  wss = new WebSocket.Server({ clientTracking: false, noServer: true });

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

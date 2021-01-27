import { Server } from "http";
import { RequestHandler } from "express";
import WebSocket from "ws";

export function init(server: Server, sessionParser: RequestHandler) {
  const wss = new WebSocket.Server({ server });

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

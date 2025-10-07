// src/sockets/twilioSocket.js
import { WebSocketServer } from "ws";

let wss;

export function initTwilioSocket(server) {
  wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws) => {
    console.log("🎧 Twilio connected for live audio streaming");

    ws.on("message", (msg) => {
      const data = JSON.parse(msg);
      if (data.event === "media") {
        const audioChunk = Buffer.from(data.media.payload, "base64");
        console.log("🎙️ Audio chunk:", audioChunk.length);
        // Forward to AI / STT / save
      }
      if (data.event === "start") console.log("✅ Stream started");
      if (data.event === "stop") console.log("🛑 Stream stopped");
    });

    ws.on("close", () => console.log("❌ Stream disconnected"));
  });

  // HTTP Upgrade for WebSocket
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/audio-stream") {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    } else {
      socket.destroy();
    }
  });
}

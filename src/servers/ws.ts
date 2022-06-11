import { WebSocketServer } from "ws";
import { ServerEvents } from "../utils/serverevents";
import { WebsocketEvents } from "../utils/websocketevents";
import { env } from "../utils/helper";

export const wss = new WebSocketServer({
  port: parseInt(env("WS_PORT")),
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

wss.on(ServerEvents.connection, function connection(ws) {
  console.log(`Online users : ${wss.clients.size}`);

  ws.on(WebsocketEvents.close, function close() {
    console.log("connection closed");
    console.log(`Online users : ${wss.clients.size}`);
  });

  ws.on(WebsocketEvents.message, function message(data) {
    ws.send("you sent: " + data);
  });
});

console.log("websocket at port ", env("WS_PORT"));
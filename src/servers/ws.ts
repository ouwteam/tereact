import { WebSocketServer } from "ws";
import { ServerEvents } from "../utils/serverevents";
import { WebsocketEvents } from "../utils/websocketevents";
import { Room } from "../interfaces/room";

var room: Room = {
  room1: [],
};

export const wss = new WebSocketServer({
  port: 8080,
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
  room.room1.push(ws);

  ws.on(WebsocketEvents.close, function close() {
    console.log("connection closed");
    console.log(`Online users : ${wss.clients.size}`);

    // remove from list room
    room.room1.splice(room.room1.indexOf(ws), 1);
  });

  ws.on(WebsocketEvents.message, function message(data) {
    console.log("received: %s", data);
    ws.send("you sent: " + data);

    console.log(`User in room 1 : ${room.room1.length}`);
  });
});

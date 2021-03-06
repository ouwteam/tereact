import express from "express";
import * as core from "express-serve-static-core";
import bodyParser from "body-parser";
import * as http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { ServerEvents } from "../utils/serverevents";
import { ClientEvents } from "../utils/clientevents";

console.log("Server initialized..");
const app = express();
app.use(bodyParser.json());
app.use(cors<express.Request>());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export function initHttpServer(port: number, hostname: string) {
  io.on(ServerEvents.connection, (socket: Socket) => {
    console.log("a user connected");

    socket.on(ClientEvents.subscribe_room, (data) => {
      console.log("subscribe_room", data);
      socket.join(data.room_id);
    });

    socket.on(ClientEvents.unsubscribe_room, (data) => {
      console.log("unsubscribe_room", data);
      socket.leave(data.room_id);
    });

    socket.on(ClientEvents.message, (data) => {
      console.log("message", data);
      io.to(data.room_id).emit(ClientEvents.message, data);
    });
  });

  io.on(ServerEvents.disconnect, (socket) => {
    console.log("a user disconnected");
  });

  server.listen(port, hostname, () => {
    console.log(server.address());
  });
}

export function registerRouters(
  callback: (app: core.Express, io: Server) => any
): void {
  callback(app, io);
}

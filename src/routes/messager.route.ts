import express from "express";
import { Server } from "socket.io";
import { handleBroadcast, handleSendToRoom } from "../services/messager";
var _io: Server;

const router = express.Router();
router.get("/broadcast", (req, res) => handleBroadcast(req, res, _io));
router.post("/send-to-room", (req, res) => handleSendToRoom(req, res, _io));

function setSocketServer(io: Server) {
  _io = io;
}

export = { router, setSocketServer };

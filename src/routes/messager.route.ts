import express from "express";
import { WebSocketServer } from "ws";
import { handleBroadcast } from "../services/messager";
var _wss: WebSocketServer;

const router = express.Router();
router.get("/broadcast", (req, res) => handleBroadcast(req, res, _wss));

function setSocketServer(wss: WebSocketServer) {
    _wss = wss;
}

export = { router, setSocketServer };
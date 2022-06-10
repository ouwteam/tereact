import { Request, Response } from "express";
import { WebSocket, WebSocketServer } from "ws";

export function handleIndex(req: Request, res: Response, wss?: WebSocketServer) {
    res.send({
        online_user: wss?.clients.size,
        ws_address: wss?.address(),
        httpVersion: req.httpVersion,
    });
}

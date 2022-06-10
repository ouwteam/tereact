import { Request, Response } from "express";
import { WebSocket, WebSocketServer } from "ws";

export function handleBroadcast(req: Request, res: Response, wss?: WebSocketServer) {    
    if(!req.query.message) {
        return res.status(400).send({
            ok: false,
            message: "message is required"
        });
    }

    var message = req.query.message;
    wss?.clients.forEach(function (ws: WebSocket) {
        ws.send(message, function onError(err) {
            console.error(err);
        });
    });

    return res.send({
        ok: true,
        online_user: wss?.clients.size,
    });
}
import { Request, Response } from "express";
import { Server } from "socket.io";

export function handleBroadcast(req: Request, res: Response, io: Server) {
    if(!req.query.message) {
        return res.status(400).send({
            ok: false,
            message: "message is required"
        });
    }

    var message = req.query.message;
    io.emit("message", message);

    return res.send({
        ok: true,
        online_user: io.sockets.sockets.size,
    });
}

export function handleSendToRoom(req: Request, res: Response, io: Server) {
    if(!req.body.message) {
        return res.status(400).send({
            ok: false,
            message: "message is required"
        });
    }

    if(!req.body.room_id) {
        return res.status(400).send({
            ok: false,
            message: "room_id is required"
        });
    }

    io.to(req.body.room_id).emit("message", req.body);
    return res.send({
        ok: true,
        message: "message send to room",
    });
}
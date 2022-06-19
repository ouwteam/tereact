import { Request, Response } from "express";
import { Room } from "../models/room.model";

export async function createRoom(req: Request, res: Response) {
    var post = req.body;
    var room: Room = new Room({
        title: post.title,
        description: post.description,
        room_type: post.room_type
    });

    var createdRoom = await room.save();
}
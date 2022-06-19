import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { RoomUser } from "../models/room_user.model";
import { User } from "../models/user.model";

export async function createRoom(req: Request, res: Response) {
    var post = req.body;
    var room: Room = new Room({
        title: post.title,
        description: post.description,
        room_type: post.room_type
    });

    var createdRoom = null;
    try {
        createdRoom = await room.save();
    } catch (error) {
        console.error(error);

        return res.status(400).send({
            ok: false,
            message: "create room failed"
        });
    }

    return res.send({
        ok: true,
        data: {
            room: createdRoom,
        }
    });
}

export async function getRoomDetail(req: Request, res: Response) {
    const room_id = req.params.room_id;
    const roomData = await Room.findByPk(room_id, {
        include: [{
            model: RoomUser,
            as: "participants",
            include: [{
                model: User.scope("withoutPassword"),
                as: "user"
            }],
        }]
    });
    if (!roomData) {
        return res.status(400).send({
            ok: false,
            message: "Room not found",
        });
    }

    return res.send({
        ok: true,
        data: {
            room: roomData,
        }
    });
}

export async function addUserToRoom(req: Request, res: Response) {
    const room_id = req.params.room_id;
    const user_id = req.body.user_id;
    const roomData = await Room.findByPk(room_id);
    if (!roomData) {
        return res.status(400).send({
            ok: false,
            message: "Room not found",
        });
    }

    var check = await RoomUser.findAll({
        where: {
            room_id: room_id,
            user_id: user_id
        }
    });
    if (check.length > 0) {
        return res.status(400).send({
            ok: false,
            message: "User already in room",
        });
    }

    var roomUser: RoomUser = new RoomUser({
        room_id: room_id,
        user_id: user_id
    });

    var createdRoomUser = null;
    try {
        createdRoomUser = await roomUser.save();
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            ok: false,
            message: "add user to room failed"
        });
    }

    return res.send({
        ok: true,
        data: {
            roomUser: createdRoomUser,
        }
    });
}
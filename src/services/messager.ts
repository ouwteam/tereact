import { Request, Response } from "express";
import { Server } from "socket.io";
import { Contact } from "../models/contact.model";
import { Room } from "../models/room.model";
import { RoomMessage } from "../models/room_message.model";
import { RoomUser } from "../models/room_user.model";
import { User } from "../models/user.model";
import { Op } from "sequelize";

export function handleBroadcast(req: Request, res: Response, io: Server) {
  if (!req.query.message) {
    return res.status(400).send({
      ok: false,
      message: "message is required",
    });
  }

  var message = req.query.message;
  io.emit("message", message);

  return res.send({
    ok: true,
    online_user: io.sockets.sockets.size,
  });
}

export async function handleSendToRoom(req: Request, res: Response, io: Server) {
  if (!req.body.message) {
    return res.status(400).send({
      ok: false,
      message: "message is required",
    });
  }

  if (!req.body.room_id) {
    return res.status(400).send({
      ok: false,
      message: "room_id is required",
    });
  }

  if (!req.body.user_id) {
    return res.status(400).send({
      ok: false,
      message: "user_id is required",
    });
  }

  var post = req.body;
  // check, is room exists?
  var row = await Room.findByPk(post.room_id);
  if (row == null) {
    return res.status(400).send({
      ok: false,
      message: "Room not found",
    });
  }

  if(row.room_type == "PRIVATE") {
    var participants = await row.getParticipants({
      where: {
        user_id: {
          [Op.ne]: post.user_id
        }
      }
    });

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const contact = await Contact.findOne({
        where: {
          user_id: participant.user_id,
          guest_id: post.user_id,
        }
      });

      if(contact != null) {
        contact.snapshot = post.message;
        contact.lastInteract = new Date(Date.now());
        contact.save();
      }
    }
  }

  // check, is sender blongs to room?
  var rows = await RoomUser.findAll({
    where: {
      room_id: post.room_id,
      user_id: post.user_id,
    }
  });
  if (rows.length == 0) {
    return res.status(400).send({
      ok: false,
      message: "Unable to send message to selected room",
    });
  }

  var message: RoomMessage = new RoomMessage({
    room_id: post.room_id,
    user_id: post.user_id,
    message_text: post.message,
  });

  try {
    await message.save();
  } catch (error) {
    console.error(error);
    return res.send({
      ok: true,
      message: "failed to send message",
    });
  }

  const sender = await message.getSender({ scope: ['withoutPassword'] });
  const emitMessage = { message: message, sender: sender };
  io.to(post.room_id).emit("message", emitMessage);
  return res.send({
    ok: true,
    data: emitMessage,
    message: "message send to room",
  });
}

export async function handleGetMessages(req: Request, res: Response) {
  if (!req.query.room_id) {
    return res.status(400).send({
      ok: false,
      message: "room_id is required",
    });
  }

  if (!req.query.user_id) {
    return res.status(400).send({
      ok: false,
      message: "user_id is required",
    });
  }

  const room_id = req.query.room_id;
  const user_id = req.query.user_id;
  // check, is user blongs to room?
  var rows = await RoomUser.findAll({
    where: {
      room_id: room_id,
      user_id: user_id,
    }
  });
  if (rows.length == 0) {
    return res.status(400).send({
      ok: false,
      message: "Unable to fetch message from selected room",
    });
  }

  const messages = await RoomMessage.findAll({
    where: {
      room_id: room_id
    },
    include: [
      {
        model: User.scope("withoutPassword"),
        as: "sender",
      },
    ],
    order: [
      ['createdAt', 'desc']
    ],
    limit: 25,
  });

  return res.send({
    ok: true,
    data: { messages: messages },
    message: "",
  });
}
import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { RoomUser } from "../models/room_user.model";
import { User } from "../models/user.model";
import sequelize from "../servers/database";

export async function createRoom(req: Request, res: Response) {
  var post = req.body;
  if(!post.room_type || post.room_type == "") {
    return res.status(400).send({
      ok: false,
      message: "Room type are required",
    });
  }

  if(!post.user_ids || !Array.isArray(post.user_ids)) {
    return res.status(400).send({
      ok: false,
      message: "user_ids is required and should an array or list of user_id",
    });
  }

  var room: Room = new Room({
    title: post.title,
    description: post.description,
    room_type: post.room_type,
  });

  var createdRoom: Room;
  const t = await sequelize.transaction();
  try {
    createdRoom = await room.save({
      transaction: t
    });

    const user_ids: number[] = req.body.user_ids;
    for (let index = 0; index < user_ids.length; index++) {
      const user_id = user_ids[index];
      var check = await RoomUser.findAll({
        where: {
          room_id: createdRoom.id,
          user_id: user_id,
        },
      });

      if (check.length > 0) {
        return res.status(400).send({
          ok: false,
          message: "User already in room",
        });
      }

      var roomUser: RoomUser = new RoomUser({
        room_id: createdRoom.id,
        user_id: user_id,
      });

      await roomUser.save({ transaction: t });
    }

    t.commit();
  } catch (error) {
    t.rollback();
    console.error(error);

    return res.status(400).send({
      ok: false,
      message: "create room failed",
    });
  }

  return res.send({
    ok: true,
    data: {
      room: createdRoom,
    },
  });
}

export async function getRoomDetail(req: Request, res: Response) {
  const room_id = req.params.room_id;
  const roomData = await Room.findByPk(room_id, {
    include: [
      {
        model: RoomUser,
        as: "participants",
        include: [
          {
            model: User.scope("withoutPassword"),
            as: "user",
          },
        ],
      },
    ],
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
    },
  });
}

export async function addUserToRoom(req: Request, res: Response) {
  const room_id = req.params.room_id;
  const user_ids: number[] = req.body.user_ids;
  const roomData = await Room.findByPk(room_id);

  if (!roomData) {
    return res.status(400).send({
      ok: false,
      message: "Room not found",
    });
  }

  const t = await sequelize.transaction();
  user_ids.forEach(async user_id => {
    var check = await RoomUser.findAll({
      where: {
        room_id: room_id,
        user_id: user_id,
      },
    });

    if (check.length > 0) {
      return res.status(400).send({
        ok: false,
        message: "User already in room",
      });
    }

    var roomUser: RoomUser = new RoomUser({
      room_id: room_id,
      user_id: user_ids,
    });

    try {
      await roomUser.save({ transaction: t });
    } catch (error) {
      t.rollback();
      console.error(error);
      return res.status(400).send({
        ok: false,
        message: "add user to room failed",
      });
    }
  });

  t.commit();
  const roomUser = await Room.findByPk(room_id, {
    include: [
      {
        model: RoomUser,
        as: "participants",
        include: [
          {
            model: User.scope("withoutPassword"),
            as: "user",
          },
        ],
      },
    ]
  });

  return res.send({
    ok: true,
    data: {
      roomUser: roomUser,
    },
  });
}

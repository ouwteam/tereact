import { Room } from "../models/room.model";
import sequelize from "../servers/database";

export function env(key: string): string {
  var output = process.env[key] ? process.env[key] : "";
  if (output == undefined) {
    return "";
  }

  return output.toString();
}

export async function getSamePrivateRoom(userId: number, guestId: number) {
  var sql = `SELECT c.* FROM (
    SELECT
      a.*,
      case when a.room_id = b.room_id then 'sameroom' ELSE '' END AS same_room
    FROM room_users a, room_users b 
    WHERE a.user_id = ? AND b.user_id = ?
    ) tmp 
    JOIN rooms c ON tmp.room_id = c.id
    WHERE tmp.same_room = 'sameroom' AND c.room_type = 'PRIVATE';`;
  const rows = await sequelize.query(sql, {
    replacements: [userId, guestId],
    model: Room,
    mapToModel: true
  });

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

export async function inSamePrivateRoom(userId: number, guestId: number) {
  var row = await getSamePrivateRoom(userId, guestId);
  if (row == null) {
    return false;
  }

  return true;
}


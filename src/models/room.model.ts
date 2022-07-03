import { DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import sequelize from "../servers/database";
import { RoomUser } from "./room_user.model";

export class Room extends Model {
  declare id: number;
  declare title?: string;
  declare description?: string;
  declare room_type: string;

  declare getParticipants: HasManyGetAssociationsMixin<RoomUser>;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    room_type: {
      type: DataTypes.STRING,
    },
  },
  { sequelize }
);

Room.hasMany(RoomUser, {
  foreignKey: "room_id",
  as: "participants",
});

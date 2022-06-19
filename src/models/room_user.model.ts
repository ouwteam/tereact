import { DataTypes, Model } from "sequelize";
import sequelize from "../servers/database";
import { User } from "./user.model";

export class RoomUser extends Model {
  declare id: number;
  declare room_id: number;
  declare user_id: number;
}

RoomUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  { tableName: "room_users", sequelize }
);

RoomUser.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

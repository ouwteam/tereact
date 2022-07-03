import { BelongsToGetAssociationMixin, DataTypes, Model } from "sequelize";
import sequelize from "../servers/database";
import { User } from "./user.model";

export class RoomMessage extends Model {
  declare id: number;
  declare room_id: number;
  declare user_id: number;
  declare message_text: string;
  declare attachments?: string;

  declare getSender: BelongsToGetAssociationMixin<User>;
}

RoomMessage.init(
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
    message_text: {
      type: DataTypes.STRING,
    },
    attachments: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize, 
    tableName: "room_messages",
  }
);

RoomMessage.belongsTo(User, {
  foreignKey: "user_id",
  as: "sender",
});
import { BelongsToGetAssociationMixin, DataTypes, Model } from "sequelize";
import sequelize from "../servers/database";
import { User } from "./user.model";

export class Contact extends Model {
  declare id: number;
  declare user_id: number;
  declare guest_id: number;
  declare alias?: string;
  declare lastInteract?: Date;
  declare snapshot?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  
  declare user?: User;
  declare getUser: BelongsToGetAssociationMixin<User>;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    guest_id: {
      type: DataTypes.INTEGER,
    },
    alias: {
      type: DataTypes.STRING,
    },
    snapshot: {
      type: DataTypes.STRING,
    },
    lastInteract: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize
  }
);

Contact.belongsTo(User, {
  foreignKey: "guest_id",
  as: "user",
});

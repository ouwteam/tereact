import { BelongsToGetAssociationMixin, DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import sequelize from "../servers/database";
import { User } from "./user.model";

export class Contact extends Model {
  declare id: number;
  declare title?: string;
  declare description?: string;
  declare room_type: string;

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
  },
  { sequelize }
);

Contact.belongsTo(User, {
  foreignKey: "guest_id",
  as: "user",
});

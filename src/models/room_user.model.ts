import { DataTypes, Model } from 'sequelize';
import sequelize from '../servers/database';

export class RoomUser extends Model {
    declare id: number;
    declare room_id: number;
    declare user_id: number;
}

RoomUser.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    room_id: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
}, { sequelize });

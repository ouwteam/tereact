import { DataTypes, Model } from 'sequelize';
import sequelize from '../servers/database';

export class RoomMessage extends Model {
    declare id: number;
    declare room_id: number;
    declare user_id: number;
	declare message_text: string;
	declare attachments?: string;
}

RoomMessage.init({
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
    message_text: {
        type: DataTypes.STRING,
    },
    attachments: {
        type: DataTypes.STRING,
    },
}, { sequelize });

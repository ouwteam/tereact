import { DataTypes, Model } from 'sequelize';
import sequelize from '../servers/database';

export class Room extends Model {
    declare id: number;
    declare title?: string;
    declare description?: string;
    declare room_type: string;
}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
}, { sequelize });

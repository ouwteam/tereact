import { DataTypes, Model } from 'sequelize';
import sequelize from '../servers/database';

export class User extends Model {
    declare id: number;
    declare username: string;
    declare password?: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
}, { sequelize });

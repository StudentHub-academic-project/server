import {DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import { sequelize } from '../config';

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  uuid: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export const UserModel = sequelize.define<UserModel>(
  'User',
  {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
);

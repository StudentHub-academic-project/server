import { sequelize } from '../config';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export interface PostModel
  extends Model<
    InferAttributes<PostModel>,
    InferCreationAttributes<PostModel>
  > {
  uuid: string;
  title: string;
  content: string;
  userId: string;
  rating?: number;
  votes?: number;
}

export const PostModel = sequelize.define<PostModel>(
  'Post',
  {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'post',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
);

import path from "node:path";
import * as os from "os";
import {DataTypes, Sequelize} from "sequelize";

const dbName = 'studenthub_db';
const rootDir = path.join(os.homedir(), '.studenthub');
const dbPath = path.join(rootDir, dbName);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

const UserModel = sequelize.define('User', {
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

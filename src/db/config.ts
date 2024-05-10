import path from 'node:path';
import * as os from 'os';
import { Sequelize } from 'sequelize';
import { PostModel, UserModel } from './models';

const dbName = 'studenthub_db';
const rootDir = path.join(os.homedir(), '.studenthub');
const dbPath = path.join(rootDir, dbName);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

(async () => {
  await sequelize.authenticate();
  await UserModel.sync({ force: true });
  await PostModel.sync({ force: true });
})();

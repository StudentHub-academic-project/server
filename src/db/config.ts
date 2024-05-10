import path from 'node:path';
import * as os from 'os';
import { Sequelize } from 'sequelize';
import { PostModel, UserModel } from './models';
import { handleErrorSync } from '@stlib/utils';

const dbName = process.env.DB_NAME || 'studenthub_db.sql';
const rootDir = path.join(os.homedir(), '.studenthub');
const dbPath = path.join(rootDir, dbName);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    await UserModel.sync();
    await PostModel.sync();
    return console.log('Database connection established successfully.');
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
})();

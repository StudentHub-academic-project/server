import './api';
import { handleErrorSync } from '@stlib/utils';
import { PostModel, sequelize, UserModel } from './db';

(async () => {
  try {
    await sequelize.authenticate();
    await UserModel.sync({ force: true });
    await PostModel.sync({ force: true });
    return console.log('Database connection established successfully.');
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
})();

import dotenv from 'dotenv';
import express from 'express';
import { AuthController } from '../auth';
import { rateLimitter } from '../middleware';
import { UserController } from '../user';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 9110;
const HOST: string = process.env.HOST || 'localhost';

export const app = express();
app.use(express.json());
app.use(rateLimitter);

app.use('/auth', AuthController);
app.use('/', UserController);

export const server = app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

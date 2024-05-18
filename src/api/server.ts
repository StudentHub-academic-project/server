import dotenv from 'dotenv';
import express from 'express';
import { AuthController } from '../auth';
import { rateLimitter } from '../middleware';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 9110;
const HOST: string = process.env.HOST || 'localhost';

export const app = express();
app.use(express.json());
app.use(rateLimitter);

app.use('/auth', AuthController);

export const server = app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 9110;
const HOST: string = process.env.HOST || 'localhost';

export const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

import express from 'express';
import { signup } from './auth.service';

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signup);

import express from 'express';
import { signup } from './auth.service';
import {signupValidation} from "../middleware";

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidation, signup);

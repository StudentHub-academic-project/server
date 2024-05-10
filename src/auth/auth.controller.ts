import express from 'express';
import { signin, signup } from './auth.service';
import { signinValidation, signupValidation } from '../middleware';

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidation, signup);
AuthRouter.post('/signin', signinValidation, signin);

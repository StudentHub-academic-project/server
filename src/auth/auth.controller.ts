import express from 'express';
import { signin, signup } from './auth.service';
import { signinValidation, signupValidation } from '../middleware';

export const AuthController = express.Router();

AuthController.post('/signup', signupValidation, signup);
AuthController.post('/signin', signinValidation, signin);

import express from 'express';
import { isLoggedIn } from '../middleware';
import { editUser, getUser } from './user.service';

export const UserController = express.Router();

UserController.use(isLoggedIn);
UserController.get('/me', getUser);
UserController.get('/:username', getUser);
UserController.get('/id/:user_id', getUser);
UserController.patch('/me', editUser);

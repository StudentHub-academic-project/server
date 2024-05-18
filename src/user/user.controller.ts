import express from "express";
import {isLoggedIn} from "../middleware";

export const UserController = express.Router();

UserController.use(isLoggedIn);
UserController.get('/me');
UserController.patch('/me');

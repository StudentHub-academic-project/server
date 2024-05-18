import express from "express";
import {isLoggedIn} from "../middleware";
import {getUser} from "./user.service";

export const UserController = express.Router();

UserController.use(isLoggedIn);
UserController.get('/me', getUser);
UserController.patch('/me');

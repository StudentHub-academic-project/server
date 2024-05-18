import express from "express";

export const UserController = express.Router();

UserController.get('/me');
UserController.patch('/me');

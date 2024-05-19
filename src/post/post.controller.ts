import express from "express";
import {isLoggedIn} from "../middleware";

export const PostController = express.Router();

PostController.use(isLoggedIn);
PostController.get('/posts');
PostController.get('/posts/:id')
PostController.post('/posts')
PostController.patch('/posts/:id')
PostController.delete('/posts/:id')

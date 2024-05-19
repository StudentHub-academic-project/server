import express from "express";
import {isLoggedIn} from "../middleware";

export const PostController = express.Router();

PostController.use(isLoggedIn);
PostController.get('/');
PostController.get('/:id')
PostController.post('/')
PostController.patch('/:id')
PostController.delete('/:id')

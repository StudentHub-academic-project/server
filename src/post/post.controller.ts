import express from "express";
import {isLoggedIn} from "../middleware";
import {createPost, getAllPosts, getPostById} from "./post.service";

export const PostController = express.Router();

PostController.use(isLoggedIn);
PostController.get('/', getAllPosts);
PostController.get('/:post_id', getPostById)
PostController.post('/', createPost)
PostController.patch('/:post_id')
PostController.delete('/:post_id')

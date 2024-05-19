import express from "express";
import {isLoggedIn} from "../middleware";
import {createPost, deletePost, editPost, getAllPosts, getPostById} from "./post.service";

export const PostController = express.Router();

PostController.use(isLoggedIn);
PostController.get('/', getAllPosts);
PostController.get('/:post_id', getPostById)
PostController.post('/', createPost)
PostController.patch('/:post_id', editPost)
PostController.delete('/:post_id', deletePost);

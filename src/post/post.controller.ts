import express from "express";
import {isLoggedIn, postValidation} from "../middleware";
import {createPost, deletePost, editPost, getAllPosts, getPostById} from "./post.service";

export const PostController = express.Router();

PostController.use(isLoggedIn);
PostController.get('/', getAllPosts);
PostController.get('/:post_id', getPostById)
PostController.post('/', postValidation, createPost)
PostController.patch('/:post_id', postValidation, editPost)
PostController.delete('/:post_id', deletePost);

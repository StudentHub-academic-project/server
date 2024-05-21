import { PostModel } from '../db';
import { Request, Response } from 'express';
import {handleError, handleErrorSync} from '@stlib/utils';
import { CreatePostDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { EditPostDto } from './dto/edit-post.dto';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.findAll();

    return res.status(200).json({ posts });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;

    const post = await PostModel.findOne({
      where: {
        uuid: post_id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Not found.' });
    }

    return res.status(200).json({ post });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { sub } = req.user;
    const dto: CreatePostDto = req.body;

    if(dto.title == null || undefined || dto.content == null || undefined) {
      return res.status(400).json({ error: 'Title and content of post cannot be null or undefined.' });
    }

    if (!sub) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const post = await PostModel.create({
      uuid: uuidv4(),
      userId: sub,
      title: dto.title,
      content: dto.content,
      rating: 0,
      votes: 0,
    });

    return res.status(201).json({ post });
  } catch (error) {
    handleErrorSync(error)
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const { sub } = req.user;
    const dto: EditPostDto = req.body;

    if(dto.title == null || undefined || dto.content == null || undefined) {
      return res.status(400).json({ error: 'Title and content of post cannot be null or undefined.' });
    }

    if (!sub) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const post = await PostModel.findOne({
      where: {
        uuid: post_id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Not found.' });
    }

    if (dto.rating) {
      const prevrate = post.rating ?? 0;
      let votes = post.votes + 1 ?? 1;
      const rating = (prevrate + dto.rating) / votes;

      post.set({
        votes,
        rating: Number(rating.toFixed(1)),
      });
    } else if (post.userId === sub) {
      post.set({
        title: dto.title ?? post.title,
        content: dto.content ?? post.content,
      });
    }

    await post.save().catch(() => {});

    return res.status(200).json({ post });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const { sub } = req.user;

    if (!sub) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const post = await PostModel.findOne({
      where: {
        uuid: post_id,
        userId: sub,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Not found.' });
    }

    await post.destroy();

    return res.status(204).json({ message: 'Post has been deleted.' });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

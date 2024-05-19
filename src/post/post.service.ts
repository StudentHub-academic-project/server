import { PostModel } from '../db';
import { Request, Response } from 'express';
import { handleError } from '@stlib/utils';
import { CreatePostDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { EditPostDto } from './dto/edit-post.dto';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { sub } = req.user;

    const posts = await PostModel.findAll({
      where: {
        userId: sub,
      },
    });

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

    if (!sub) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const post = await PostModel.create({
      uuid: uuidv4(),
      userId: sub,
      title: dto.title,
      content: dto.content,
      rating: 0,
    });

    return res.status(201).json({ post });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const { sub } = req.user;
    const dto: EditPostDto = req.body;

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
      const votes = post.votes ?? 1;
      const rating = prevrate + dto.rating / votes;

      post.set({
        rating,
      });
    } else if (post.userId === sub) {
      post.set({
        title: dto.title ?? post.title,
        content: dto.content ?? post.content,
      });
    }

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

import { Request, Response } from 'express';
import { PostModel, UserModel } from '../db';
import { EdituserDto } from './dto';
import { handleError, isExists } from '@stlib/utils';
import * as fs from 'fs';
import path from 'node:path';
import { rootDir } from '../materials';

export const getUser = async (req: Request, res: Response) => {
  try {
    const username = req.params?.username || req.user.username;

    const user = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Not found.' });
    }

    if (!user?.uuid) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const posts = await PostModel.findAll({
      where: {
        userId: user.uuid,
      },
    });

    const dirpath = path.join(rootDir, 'storage', user.uuid);

    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return res.status(200).json({ user, posts, materials: [] });
    }

    const materials = await fs.promises.readdir(dirpath);

    return res.status(200).json({ user, posts, materials });
  } catch (error) {
    return await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const dto: EdituserDto = req.body;

    const [user] = await UserModel.findAll({
      where: {
        email,
      },
    });

    user.set({
      username: dto.username ? dto.username : user.username,
      fullname: dto.fullname ? dto.fullname : user.fullname,
    });

    await user.save().catch(() => {});

    return res.status(200).json(user);
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};

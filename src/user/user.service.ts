import { Request, Response } from 'express'
import {UserModel} from "../db";
import {EdituserDto} from "./dto";
import {handleError} from "@stlib/utils";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;

    const [user] = await UserModel.findAll({
      where: {
        email
      }
    })

    if(!user) {
      return res.status(404).json('Not found.');
    }

    return res.status(200).json({ user });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const dto: EdituserDto = req.body;

    const [user] = await UserModel.findAll({
      where: {
        email
      }
    });

    user.set({
      username: dto.username ? dto.username : user.username,
      fullname: dto.fullname ? dto.fullname : user.fullname,
    })

    await user.save().catch(() => {});

    return res.status(200).json(user);
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  }
}

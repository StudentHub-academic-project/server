import { Request, Response } from 'express'
import {UserModel} from "../db";
import {EdituserDto} from "./dto";
import {handleError} from "@stlib/utils";

export const getUser = (req: Request, res: Response) => {
  return res.status(200).json({ profile: req.user });
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

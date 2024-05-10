import { Response, Request } from 'express';
import { handleError } from '@stlib/utils';
import { SignupDto } from './dto';
import * as argon from 'argon2';
import { UserModel } from '../db';
import { v4 as uuid } from 'uuid';

export const signup = async (req: Request, res: Response) => {
  try {
    const dto: SignupDto = req.body;
    const hash = await hashPassword(dto.password);

    const isExists = await UserModel.findAll({
      where: {
        email: dto.email,
        username: dto.username,
      },
    });

    if (isExists.length !== 0) {
      console.log(isExists);
      return res.status(403).json('Forbidden.');
    }

    const user = await UserModel.create({
      uuid: uuid(),
      username: dto.username,
      fullname: dto.fullname,
      email: dto.email,
      password: hash,
    });

    return res.status(201).json(user);
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json('Internal server error.');
    });
  }
};

export const hashPassword = async (password: string) => {
  const hashConfig: argon.Options = {
    timeCost: 10,
    type: argon.argon2id,
  };

  return await argon.hash(password, hashConfig);
};

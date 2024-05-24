import { Response, Request } from 'express';
import {handleErrorSync} from '@stlib/utils';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { UserModel } from '../db';
import { v4 as uuid } from 'uuid';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import {BadRequestException, ForbiddenException, HashException} from "../lib";

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
      return new ForbiddenException(res);
    }

    const user = await UserModel.create({
      uuid: uuid(),
      username: dto.username,
      fullname: dto.fullname,
      email: dto.email,
      password: hash,
    });

    return res.status(201).json({ user });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const hashPassword = async (password: string) => {
  const hashConfig: argon.Options = {
    timeCost: 10,
    type: argon.argon2id,
  };

  return await argon.hash(password, hashConfig).catch(() => {
    throw new HashException();
  });
};

export const signin = async (req: Request, res: Response) => {
  try {
    const dto: SigninDto = req.body;

    const user = await UserModel.findAll({
      where: {
        email: dto.email,
      },
    });

    if (user.length === 0) {
      return new BadRequestException(res, 'Credentioals are incorrect.');
    }

    const pwMatch = argon.verify(user[0].password, dto.password);

    if (!pwMatch) {
      return new BadRequestException(res, 'Credentioals are incorrect.');
    }

    const token = await signToken(user[0]);

    return res.status(200).json({ token });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const signToken = async (user: UserModel) => {
  const payload: JwtPayload = {
    sub: user.uuid,
    email: user.email,
    username: user.username,
  };

  const jwtkey = process.env.JWT_KEY;

  if (jwtkey === undefined) {
    throw new JsonWebTokenError(
      'Secret or private key is missing. Define it in environment variables.',
    );
  }

  return jwt.sign(payload, jwtkey, {
    expiresIn: '15d',
  });
};

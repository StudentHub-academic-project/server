import {NextFunction, Request, Response} from 'express';
import jwt, {JsonWebTokenError, JwtPayload} from "jsonwebtoken";
import {handleError} from "@stlib/utils";

declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload
  }
}

function extractToken(header: string) {
  const [format, token] = header.split(' ');

  if(!token || format !== 'Bearer') {
    throw new Error('Invalid authorization header format.');
  }

  return token;
}

async function verifyToken(token: string, secretkey: any): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretkey, (error: unknown, decoded: unknown) => {
      if(error) {
        reject(error);
      }

      resolve(decoded as JwtPayload);
    })
  })
}

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const secretkey = process.env.JWT_KEY;

  if(!secretkey) {
    throw new JsonWebTokenError(`Provide a 'JWT_KEY' in your .env file.`);
  }

  try {
    const header = req.headers.authorization

    if(!header) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const token = extractToken(header);

    req.user = await verifyToken(token, secretkey);

    next();
  } catch (error) {
    await handleError(error, () => {
      res.status(401).json({ error: 'Unauthorized.' });
    });
  }
}

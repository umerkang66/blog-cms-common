import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

type Role = 'user' | 'writer' | 'admin';
// interface that describes the properties that user document has
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      currentuser?: UserDocument;
    }
  }
}

export function getCurrentuser(UserModel: mongoose.Model<UserDocument>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.jwt) {
      return next();
    }

    try {
      const payload = jwt.verify(
        req.cookies.jwt,
        process.env.JWT_KEY!
      ) as JwtPayload;

      // payload.id is set in the createSendToken
      const user = await UserModel.findById(payload.id);
      if (!user) return next();
      req.currentuser = user;
      // if there is error don't do anything, there could be an error, if jwt_key is not correct
    } catch (err) {}

    next();
  };
}

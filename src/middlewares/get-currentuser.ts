import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

type Role = 'user' | 'writer' | 'admin';
// interface that describes the properties that user document has
interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  changedPasswordAfter: (jwtIssuedAt: number) => boolean;
}

interface UserModelInterface extends mongoose.Model<UserDocument> {}

declare global {
  namespace Express {
    interface Request {
      currentuser?: UserDocument;
    }
  }
}

export function getCurrentuser(UserModel: UserModelInterface) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // this req.cookies and req.cookies.jwt is coming from cookie-parser library
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

      // if the user's password has been changed after the token has been issued
      // then token should not work
      if (user.changedPasswordAfter(payload.iat as number)) {
        return next();
      }

      req.currentuser = user;
      // if there is error don't do anything, there could be an error, if jwt_key is not correct
    } catch (err) {}

    next();
  };
}

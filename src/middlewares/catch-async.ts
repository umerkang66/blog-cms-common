import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';

type AsyncFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (asyncFunc: AsyncFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // currently in this application we are not using the nextFunction

    asyncFunc(req, res, next).catch((err: any) => {
      throw new BadRequestError(err.message || 'Something went wrong 🛑🛑🛑');
    });
  };
};

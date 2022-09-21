import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';

type AsyncFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

type NormFunc = (req: Request, res: Response, next: NextFunction) => void;

export const catchAsync = (asyncFunc: AsyncFunc): NormFunc => {
  return (req: Request, res: Response, next: NextFunction) => {
    // currently in this application we are not using the nextFunction

    asyncFunc(req, res, next).catch((err: any) => {
      throw new BadRequestError(err.message || 'Something went wrong 🛑🛑🛑');
    });
  };
};

import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/**
 * Send error to client, if user is not logged in.
 *
 * Always use getCurrentUser before requireAuth.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentuser) {
    throw new NotAuthorizedError();
  }
  next();
};

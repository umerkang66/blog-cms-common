import { NextFunction, Request, Response } from 'express';
import { NotAuthenticatedError } from '../errors/not-authenticated-error';

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
    throw new NotAuthenticatedError();
  }
  next();
};

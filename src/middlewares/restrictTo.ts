import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import type { Role } from '../common-types/role';

// current-user, and requireAuth should be used before restrict to.
export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.currentuser!.role;
    if (!roles.includes(role)) {
      throw new NotAuthorizedError();
    }

    next();
  };
};

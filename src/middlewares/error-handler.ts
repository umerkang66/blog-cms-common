import type { Request, Response, NextFunction } from 'express';
import { CustomError, CustomErrorArr } from '../errors/custom-error';

interface ResponseError {
  errors: CustomErrorArr;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ResponseError>,
  next: NextFunction
) => {
  // always return object that contains errors, that is a array of message, or field property, that is done by serialize error, below is done manually
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // It is not one of the defined errors
  console.log(err);
  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};

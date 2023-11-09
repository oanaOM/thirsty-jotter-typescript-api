import { NextFunction, Request, Response } from "express";
import HttpException from "../common/http-exceptions";

// Important note: you must provide four arguments to identify a function as an error-handling middleware in Express
export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  // the next object needs to be specified even if it's not being used in order to maintain the error-handling signature. Otherwise, Express interprets the next object as a regular middleware function and it won't handle the errors
  /* eslint-disable @typescript-eslint/no-unused-vars */
  next: NextFunction
  /* eslint-enable @typescript-eslint/no-unused-vars */
) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send(error);
};

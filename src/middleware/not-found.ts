import { Response, Request, NextFunction } from "express";

export const notFoundHandler = (
  request: Request,
  response: Response,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  next: NextFunction
  /* eslint-enable @typescript-eslint/no-unused-vars */
) => {
  const message = "Resource not found";

  response.status(404).send(message);
};

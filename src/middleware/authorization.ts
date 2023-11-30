import { Response, Request, NextFunction } from "express";
import { Users, getXataClient } from "../xata";

export const authMiddleware = async (
  request: Request,
  response: Response,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  next: NextFunction
  /* eslint-enable @typescript-eslint/no-unused-vars */
) => {
  if (!request.headers["authorization"]) {
    response.status(403).send({
      error: "Forbidden. Missing token from the 'authorization' header",
    });
  }

  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token === undefined && token !== process.env.SECRET_HASH) {
    response.status(401).send({
      error: "User unauthorized",
    });
  } else {
    const existingUser: Users | null = await getXataClient()
      .db.users.filter({ hash: token })
      .getFirst();

    if (existingUser) {
      return next();
    } else {
      response.status(401).send({
        error: "User unauthorized",
      });
    }
  }
};

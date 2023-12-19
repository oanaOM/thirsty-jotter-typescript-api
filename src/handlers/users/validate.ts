/**
 * Router Definition
 */

import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";
import * as dotenv from "dotenv";

dotenv.config();

export const userRouter = express.Router();

/**
 * Controller Definitions
 */


// POST /user - retrieves the user object if exists or a custom response otherwise
userRouter.post("/users", async (req: Request, res: Response) => {
  const payload = req.body;
  const { email } = payload;

  if (!email) {
    return res.status(400).json({
      error: {
        message: "Invalid params. Please specify your email",
      },
    });
  }


  try {
    const user: Users | null = await getXataClient().db.users.filter({ email }).getFirst();

    if (user != null) {
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } else {
      res.status(404).json({
        error: {
          message: "User not found",
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
    });
  }
});
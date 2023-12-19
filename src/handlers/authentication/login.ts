import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";

export const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 12;

/**
 * TODO:
 * - store the salt per user
 * - handle no response from Xata
 */

// POST /login 
// - validates the hash using the email and password for the payload to authenticate the user
authRouter.post("/login", async (req: Request, res: Response) => {
  const payload = req.body;
  const { password, email } = payload;

  if (!password || !email) {
    return res.status(400).send({
      error: {
        message: "Invalid params. Please specify your email and password",
      },
    });
  }

  // the user exists in our db
  const existingUser: Users | null = await getXataClient()
    .db.users.filter({ email: payload.email })
    .getFirst();

  if (existingUser != null) {
    // validate the hash

    const isValidHash = bcrypt.compareSync(
      JSON.stringify(payload),
      existingUser.hash
    );
    if (isValidHash) {
      res.status(200).send({
        message: "Welcome back user",
        email: existingUser.email,
      });
    } else {
      res.status(402).send({
        error: {
          message: "User has invalid hash",
        },
      });
    }
  } else {
    res.status(404).json({
      error: {
        message: "User not found",
      }
    });
  }
});

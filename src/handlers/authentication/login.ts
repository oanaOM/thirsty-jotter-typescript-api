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

// POST /login - creates a new user and a hash for it
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
    // user doesn't exist. Create them!
    try {
      // generate salt
      bcrypt.genSalt(saltRounds, function (err: string, salt: string) {
        if (err) throw err;
        // generate hash
        bcrypt.hash(
          JSON.stringify(req.body),
          salt,
          async function (err: string, hash: string) {
            if (err) throw err;
            const newUser: Omit<Users, "id"> = {
              email: payload,
              hash,
              salt,
            };
            await getXataClient()
              .db.users.create(newUser)
              .then((user) => {
                res.status(200).send({
                  message: "YAY! User has been successfully created",
                  email: user.email,
                });
              })
              .catch((err) => {
                res.status(400).send({
                  error: {
                    message:
                      "Oops, something went wrong when creating the user in db",
                    error: err,
                  },
                });
              });
          }
        );
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

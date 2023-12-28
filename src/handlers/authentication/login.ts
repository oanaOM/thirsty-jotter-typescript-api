import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";
import { ApiError, ApiResponse } from "../../common/types";
import session from "express-session";

export const authRouter = express.Router();
const bcrypt = require("bcryptjs");

/**
 * TODO:
 * - store the salt per user
 * - handle no response from Xata
 */

type LoginRequest = {
  email: string,
  password: string,
}

const sessionMiddleware = session({
  secret: "superSecretKey",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
});

// Middleware
authRouter.use("/login", sessionMiddleware);


/**
 * @swagger
 * /login:
 *   post:
 *     tags: 
 *      - login
 *     description: Authenticate user by their email address and password
 *     requestBody:
 *       - application/json
 *     responses:
 *      200:
 *         description: "User's object + successful response"
 *         examples:
 *          application/json: { status: 200, "user": { email: "sample@gmail.com" }, "message": "Successfully authenticated" }
 *      402:
 *         description: User with invalid hash
 *         examples:
 *          application/json: { status: 402, "error": { message: "User has invalid hash" } } 
 *      400:
 *         description: Missing params. Please specify your email and password
 *         examples:
 *          application/json: { status: 400, "error": { message: "Missing params. Please specify your email and password" } } 
 *      404:
 *         description: User not found
 *         examples:
 *          application/json: { status: 404, "error": { message: "User not found" } }
 * 
 */
authRouter.post("/login", express.urlencoded({ extended: false }), async (req: Request<LoginRequest>, res: Response<ApiResponse | ApiError>, next) => {
  const payload = req.body;
  const { password, email } = payload;

  if (!password || !email) {
    return res.status(400).send({
      status: 400,
      error: {
        message: "Missing params. Please specify your email and password",
      },
    });
  }

  // the user exists in our db
  const existingUser: Users | null = await getXataClient()
    .db.users.filter({ email: payload.email })
    .getFirst();

  if (existingUser != null) {

    const isValidHash = bcrypt.compareSync(
      JSON.stringify({ email, password }),
      existingUser.hash
    );

    console.log("--POST /login: hash:", existingUser.hash)
    console.log("--POST /login: password: ", password)
    console.log("--POST /login: isValidHash:", isValidHash)

    if (isValidHash) {

      req.session.regenerate(function (err) {
        if (err) {
          next(err)
        }

        req.session.user = existingUser.id;

        req.session.save(function (err) {
          if (err) {
            next(err)
          }

          res.status(200).send({
            status: 200,
            user: {
              id: existingUser.id,
              email: existingUser.email,
            },
            message: "Successfully authenticated",
          });

        })

      })

    } else {
      res.status(402).send({
        status: 402,
        error: {
          message: "User has invalid hash",
        },
      });
    }
  } else {
    res.status(404).json({
      status: 404,
      error: {
        message: "User not found",
      }
    });
  }
});

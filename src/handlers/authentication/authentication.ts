import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";
import { ApiAuthResponse, ApiError } from "../../common/types";

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
 *      401:
 *         description: Unauthorized. Session expired
 *         examples:
 *          application/json: { status: 400, "error": { message: "Unauthorized" } } 
 *      404:
 *         description: User not found
 *         examples:
 *          application/json: { status: 404, "error": { message: "User not found" } }
 * 
 */
authRouter.post("/login", express.urlencoded({ extended: false }), async (req: Request<LoginRequest>, res: Response<ApiAuthResponse | ApiError>, next) => {
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
            auth: {
              expiryDate: req.session.cookie.expires,
            },
            message: "Successfully authenticated",
          });
        })
      })
    } else {
      res.status(401).send({
        status: 401,
        error: {
          message: "Unauthorized",
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



/**
 * @swagger
 * /logout:
 *   get:
 *     tags: 
 *      - logout
 *     description: Clear user session
 *     requestBody:
 *       - application/json
 *     responses:
 *      302:
 *         description: Clears user session and redirects to sign-in page
 */
authRouter.get("/logout", async (req: Request, res: Response, next) => {
  // res.header("Access-Control-Allow-Origin", "")
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.destroy(function (err) {
      if (err) next(err);

      console.info("--GET /logout - clearing the session")
      res.clearCookie("session")
      res.redirect("http://localhost:4321/sign-in");
    })
  })
});
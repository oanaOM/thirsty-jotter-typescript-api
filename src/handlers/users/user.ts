import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";
import { ApiError, ApiResponseUser } from "../../common/types";

type ValidateUserRequest = {
  email: string,
}
type CreateUserRequest = Omit<Users, "id">



const bcrypt = require("bcryptjs");
const saltRounds = 12;


export const userRouter = express.Router();

/**
 * Controller Definitions
 */

/**
 * @swagger
 * /users/validate:
 *   post:
 *     tags: 
 *      - users
 *     description: Get user by their email address
 *     requestBody:
 *       - application/json
 *     parameters:
 *       - email: string
 *         description: User's email address.
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: User's object + successful response
 *      404:
 *         description: User not found
 *      500:
 *         description: Something went wrong
 */

userRouter.post("/users/validate", async (req: Request<ValidateUserRequest>, res: Response<ApiResponseUser | ApiError>) => {

  const payload = req.body;

  if (!payload.email) {
    return res.status(400).json({
      status: 400,
      error: {
        message: "Missing params. Please specify your email.",
      },
    });
  }


  const { email } = payload
  try {
    const user: Users | null = await getXataClient().db.users.filter({ email }).getFirst();

    if (user != null) {
      res.status(200).json({
        status: 200,
        user: {
          id: user.id,
          email: user.email,
        },
        message: "User found",
      });
    } else {
      res.status(404).json({
        status: 404,
        error: {
          message: "User not found",
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: {
        message: "Something went wrong",
        stack: JSON.stringify(e)
      }
    });
  }
});




/**
 * @swagger
 * /users/create:
 *   post:
 *     tags: 
 *      - users
 *     description: Creates a new user
 *     requestBody:
 *       - application/json
 *     parameters:
 *       - first_name: string
 *         description: User's first name.
 *         required: true
 *         type: string
 *       - last_name: string
 *         description: User's last name.
 *         required: true
 *         type: string
 *       - password: string
 *         description: User's password.
 *         required: true
 *         type: string
 *       - country: string
 *         description: User's country.
 *         required: true
 *         type: string
 *       - email: string
 *         description: User's email address.
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: User's object + successful response
 *      400:
 *         description: Missing params
 *      500:
 *         description: Something went wrong
 */

userRouter.post("/users/create", async (req: Request, res: Response<ApiResponseUser | ApiError>) => {
  const payload = req.body;
  const { first_name, last_name, email, country, password } = payload;

  if (!email || !first_name || !last_name || !country || !password) {
    return res.status(400).json({
      status: 400,
      error: {
        message: "Missing params. Please specify your email",
      },
    });
  }

  try {
    // generate salt
    bcrypt.genSalt(saltRounds, function (err: string, salt: string) {
      if (err) throw err;
      // generate hash
      bcrypt.hash(
        JSON.stringify({ email, password }),
        salt,
        async function (err: string, hash: string) {
          if (err) throw err;
          const newUser: CreateUserRequest = {
            email,
            first_name,
            last_name,
            country,
            hash,
            salt,
            password
          };

          console.info("--POST /user/create: Creating new user: ", newUser)

          await getXataClient()
            .db.users.create(newUser)
            .then((user) => {
              res.status(200).send({
                status: 200,
                message: "User successfully created",
                user: {
                  id: user.id,
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                },
              });
            })
            .catch((err) => {
              res.status(400).send({
                status: 400,
                error: {
                  message:
                    "Oops, something went wrong when creating the user in db",
                  stack: err,
                },
              });
            });
        }
      );
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: {
        message: "Oops, something went wrong",
        stack: JSON.stringify(err),
      },
    });
  }
});
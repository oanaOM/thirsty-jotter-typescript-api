import express, { Response, Request } from "express";
import { Users, getXataClient } from "../../xata";
import { STATUS_CODES } from "http";

const bcrypt = require("bcryptjs");
const saltRounds = 12;


export const userRouter = express.Router();

/**
 * Controller Definitions
 */

/**
 * @swagger
 * components:
 *  schemas:
 *     users:
 *      required: 
 *        - email  
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *              description: User id
 *          first_name:
 *              type: string
 *              description: User's first name
 *          last_name:
 *              type: string
 *              description: User's last name
 *          email:
 *              type: string
 *              description: User's email
 *          password:
 *              type: string
 *              description: User's password
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

userRouter.post("/users/validate", async (req: Request, res: Response) => {

  const payload = req.body;


  if (!payload.email) {
    return res.status(400).json({
      status: 400,
      error: {
        message: "Invalid params. Please specify your email.",
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
        }
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
      message: "Something went wrong",
      error: e
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

userRouter.post("/users/create", async (req: Request, res: Response) => {
  const payload = req.body;
  const { first_name, last_name, email, country } = payload;

  if (!email || !first_name || !last_name || !country) {
    return res.status(400).json({
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
        JSON.stringify(req.body),
        salt,
        async function (err: string, hash: string) {
          if (err) throw err;
          const newUser: Omit<Users, "id"> = {
            email,
            first_name,
            last_name,
            country,
            hash,
            salt,
          };


          await getXataClient()
            .db.users.create(newUser)
            .then((user) => {
              res.status(200).send({
                message: "YAY! User has been successfully created",
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
});
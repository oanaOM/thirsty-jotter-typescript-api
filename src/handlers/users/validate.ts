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
 * /users:
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
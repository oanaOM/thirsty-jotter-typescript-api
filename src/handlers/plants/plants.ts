/**
 * Router Definition
 */

import express, { Response, Request } from "express";
import { Plants, getXataClient } from "../../xata";
import * as dotenv from "dotenv";
import { sessionMiddleware } from "../../middleware/session";
import { ApiError, ApiResponsePlant } from "../../common/types";

dotenv.config();

export const plantsRouter = express.Router();


// Middleware
plantsRouter.use("/plants", sessionMiddleware);
plantsRouter.use("/plants/:id", sessionMiddleware);

/**
 * Controller Definitions
 */

/**
 * @swagger
 * /plants:
 *   get:
 *     tags: 
 *      - plants
 *     description: Get a list of user's plants
 *     requestBody:
 *       - application/json
 *     responses:
 *      200:
 *         description: User's object + successful response
 *      500:
 *         description: Something went wrong
 */
plantsRouter.get("/plants", async (req: Request, res: Response<ApiResponsePlant | ApiError>) => {

  console.log("PLANTS: req cookies:", req.session)
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 5;
  const offset = size * page - size;

  try {
    const plants = await getXataClient().db.plants
      .filter({ user_id: req.session.user })
      .getPaginated({
        pagination: { size, offset },
      });

    res.status(200).json({
      status: 200,
      plants: plants.records,
      message: "Successfully retrieve the list of plants."
    });
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
 * /plants/:id:
 *   get:
 *     tags: 
 *      - plants
 *     description: Get plant by id
 *     requestBody:
 *       - application/json
 *     responses:
 *      200:
 *         description: User's object + successful response
 *      404:
 *         description: Plant not found
 *      500:
 *         description: Something went wrong
 */
plantsRouter.get("/plants/:id", async (req: Request, res: Response<ApiResponsePlant | ApiError>) => {
  const id = req.params.id;

  try {
    const plant = await getXataClient().db.plants.read(id);

    if (plant != null) {
      res.status(200).json({
        status: 200,
        plants: [plant],
        message: "Successfully retrieve the list of plants."
      });
    } else {
      res.status(404).json({
        status: 404,
        error: {
          message: "Plant not found",
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

// POST plants
plantsRouter.post("/plants", async (req: Request, res: Response<ApiResponsePlant | ApiError>) => {
  const newPlant: Plants = req.body;

  if (Object.keys(newPlant).length === 0) {
    return res.status(204).send({
      status: 204,
      message: "Payload is empty.",
      plants: []
    });
  }

  try {
    const plant = await getXataClient().db.plants.create(newPlant);

    res.status(201).json({
      status: 201,
      plants: [plant],
      message: "Successfully created a new plant."
    });
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

// PUT plants/:id
plantsRouter.put("/plants/:id", async (req: Request, res: Response<ApiResponsePlant | ApiError>) => {
  const newPlant: Plants = req.body;

  if (Object.keys(newPlant).length === 0) {
    return res.status(204).send({
      status: 204,
      message: "Payload is empty.",
      plants: []
    });
  }

  try {
    const plantUpdate: Plants = req.body;
    if (!plantUpdate) {
      res.status(404).send();
    }
    // const existingPlant = await PlantService.findByID(id);

    // if (!existingPlant) {
    // const updatedPlant = await PlantService.update(id, plantUpdate);
    const updatedPlant = await getXataClient().db.plants.update(
      newPlant.id,
      plantUpdate
    );
    res.status(201).json({
      status: 201,
      plants: updatedPlant ? [updatedPlant] : [],
      message: "Plant details have successfully been updated.",
    });
    // } else {
    // res.status(404).send("Plant doesn't exist.");
    // }
    // TODO: create the plant if doesn't exist
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
 * /plants/:id:
 *   delete:
 *     tags: 
 *      - plants
 *     description: Delete a plant by id
 *     requestBody:
 *       - application/json
 *     responses:
 *      204:
 *         description: Plant has been successfully deleted  
 *      500:
 *         description: Something went wrong
 */

// DELETE plants/:id
plantsRouter.delete("/plants/:id", async (req: Request, res: Response<ApiResponsePlant | ApiError>) => {
  const id = req.params.id;
  try {
    // await PlantService.remove(id);
    await getXataClient().db.plants.delete(id);
    // TODO: we want to return a user friendly message back
    res.sendStatus(204);
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

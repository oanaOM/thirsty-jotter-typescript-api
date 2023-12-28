/**
 * Router Definition
 */

import express, { Response, Request } from "express";
import { Plants, getXataClient } from "../../xata";
import * as dotenv from "dotenv";
import { sessionMiddleware } from "../../middleware/session";

dotenv.config();

export const plantsRouter = express.Router();


// Middleware
plantsRouter.use("/plants", sessionMiddleware);

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
plantsRouter.get("/plants", async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 5;
  const offset = size * page - size;

  try {
    const plants = await getXataClient().db.plants.getPaginated({
      pagination: { size, offset },
    });

    res.status(200).json(plants);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
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
plantsRouter.get("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // const plant = await PlantService.findByID(id);
    const plant = await getXataClient().db.plants.read(id);

    if (plant != null) {
      res.status(200).json(plant);
    } else {
      res.status(404).json({
        error: {
          message: "Plant not found",
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

// POST plants
plantsRouter.post("/plants", async (req: Request, res: Response) => {
  try {
    const newPlant: Plants = req.body;

    if (Object.keys(newPlant).length === 0) {
      return res.status(204).send("Payload is empty.");
    }

    const plant = await getXataClient().db.plants.create(newPlant);

    res.status(201).json(plant);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
    });
  }
});

// PUT plants/:id
plantsRouter.put("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const plantUpdate: Plants = req.body;
    if (!plantUpdate) {
      res.status(404).send("Payload is empty.");
    }
    // const existingPlant = await PlantService.findByID(id);

    // if (!existingPlant) {
    // const updatedPlant = await PlantService.update(id, plantUpdate);
    const updatedPlant = await getXataClient().db.plants.update(
      id,
      plantUpdate
    );
    res.status(201).json(updatedPlant);
    // } else {
    // res.status(404).send("Plant doesn't exist.");
    // }
    // TODO: create the plant if doesn't exist
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
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
plantsRouter.delete("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // await PlantService.remove(id);
    await getXataClient().db.plants.delete(id);
    // TODO: we want to return a user friendly message back
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
    });
  }
});

/**
 * Router Definition
 */

import express, { Response, Request } from "express";
import { BasePlant } from "../models/plants";
import { getXataClient } from "../xata";

export const plantsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET plants
plantsRouter.get("/plants", async (req: Request, res: Response) => {
  try {
    // const plants: Plant[] = await PlantService.findAll();
    const plants = await getXataClient().db.plants.getPaginated();
    res.status(200).json(plants.records);
  } catch (e) {
    res.status(500).send(e);
  }
});

// GET plants/:id
plantsRouter.get("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // const plant = await PlantService.findByID(id);
    const plant = await getXataClient().db.plants.read(id);

    if (plant) {
      res.status(200).json(plant);
    } else {
      res.status(404).send("Plant not found");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// POST plants
plantsRouter.post("/plants", async (req: Request, res: Response) => {
  try {
    const newPlant: BasePlant = req.body;

    if (Object.keys(newPlant).length === 0) {
      return res.status(204).send("Payload is empty.");
    }

    // const plant = await PlantService.create(newPlant);
    const plant = await getXataClient().db.plants.create(newPlant);

    res.status(201).json(plant);
  } catch (e) {
    res.status(500).send(e);
  }
});

// PUT plants/:id
plantsRouter.put("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const plantUpdate: BasePlant = req.body;
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
    //   TODO: create the plant if doesn't exist
  } catch (e) {
    res.status(500).send(e);
  }
});

// DELETE plants/:id
plantsRouter.delete("/plants/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // await PlantService.remove(id);
    await getXataClient().db.plants.delete(id);
    // TODO: we want to return a user friendly message back
    res.sendStatus(204);
  } catch (e) {
    res.status(500).send(e);
  }
});

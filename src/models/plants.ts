/**
 * Data Model Interfaces
 */

import { plants } from "../../mocks/fixtures/plants";

export interface BasePlant {
  name: string;
  description: string;
  image: string;
  quantity: number;
  created_at_date: string;
  category: string;
  labels?: string;
}

export interface Plant extends BasePlant {
  id: number;
}

export interface Plants {
  [key: number]: Plant;
}

/**
 * Service Methods
 * to perform read and write operations on the plants store
 */

// to simulate the async nature of read and write operations, all methods are async
export const findAll = async (): Promise<Plant[]> => Object.values(plants);
export const findByID = async (id: number): Promise<Plant> => plants[id];

export const create = async (plant: BasePlant): Promise<Plant> => {
  const id = Math.random();

  plants[id] = {
    id,
    ...plant,
  };

  return plants[id];
};

export const update = async (
  id: number,
  updatedPlant: BasePlant
): Promise<Plant | null> => {
  const plant = await findByID(id);

  if (!plant) {
    return null;
  }

  plants[id] = {
    id,
    ...updatedPlant,
  };

  return plants[id];
};

export const remove = async (id: number): Promise<null | void> => {
  const plant = await findByID(id);
  if (!plant) {
    return null;
  }

  delete plants[id];
};

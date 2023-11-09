import request from "supertest";
import { app } from "../app"; // Import your Express app instance
import { expect, describe, it } from "vitest";
import { plants } from "../../mocks/fixtures/plants";

describe.only("GET /plants", () => {
  it("should return all plants", async () => {
    const response = await request(app).get("/api/plants");
    expect(response.status).toBe(200);

    expect(response.body).toEqual(Object.values(plants));
  });
});

describe("GET /plants/:id", () => {
  it("should return the plant object that matches the id passed as query param", async () => {
    const response = await request(app).get("/api/plants/1");
    expect(response.status).toBe(200);

    expect(response.body).toEqual(plants[1]);
  });

  it("should return 404 if the plant doesn't exit", async () => {
    const response = await request(app).get("/api/plants/100");
    expect(response.status).toBe(404);
  });
});

describe("POST /plants", () => {
  it("should add a new plant", async () => {
    const mockPlant = {
      id: 1,
      name: "Pepper 10",
      description: "My first pepper plant",
      image: "",
      quantity: 2,
      created_at_date: "2201202023",
      category: "veggie",
    };
    const response = await request(app).post("/api/plants").send(mockPlant);
    expect(response.status).toBe(201);

    expect(response.body).toEqual(mockPlant);
  });

  it("should return 204 if the payload is empty", async () => {
    const response = await request(app).post("/api/plants").send({});
    expect(response.status).toBe(204);
  });
});

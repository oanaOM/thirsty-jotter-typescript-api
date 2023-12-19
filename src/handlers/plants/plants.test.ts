import request from "supertest";
import { app } from "../../app";
import { expect, describe, it } from "vitest";
import { plants } from "../../../test/mocks/fixtures/plants";
import { MOCK_EXISTING_USER } from "../../../test/mocks/fixtures/users";

const getPaginated = vi.hoisted(() => vi.fn());
const read = vi.hoisted(() => vi.fn());
const create = vi.hoisted(() => vi.fn());
const getFirst = vi.hoisted(() => vi.fn());

vi.mock("../xata", async () => {
  const mod = await vi.importActual<typeof import("../../xata")>("../xata");
  return {
    ...mod,
    getXataClient: () => {
      return {
        db: {
          plants: {
            getPaginated,
            read,
            create,
          },
          users: {
            filter: () => {
              return {
                getFirst,
              };
            },
          },
        },
      };
    },
  };
});

describe.skip("GET /plants", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    getFirst.mockResolvedValue(MOCK_EXISTING_USER);
  });

  it("should return all plants", async () => {
    getPaginated.mockResolvedValue({ records: plants });

    const response = await request(app)
      .get("/api/plants")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`);
    expect(response.status).toBe(200);

    expect(JSON.stringify(response.body.records)).toEqual(
      JSON.stringify(Object.values(plants))
    );
  });
  it("should allow to return a list of plants using pagination", async () => {
    getPaginated.mockResolvedValue({ records: [plants[0], plants[1]] });

    const response = await request(app)
      .get("/api/plants?page=2&size=2")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`);
    expect(response.status).toBe(200);

    expect(response.body.records.length).toEqual(2);
  });
});

describe.skip("GET /plants/:id", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    getFirst.mockResolvedValue(MOCK_EXISTING_USER);
  });

  it("should return the plant object that matches the id passed as query param", async () => {
    read.mockResolvedValue({ records: plants[0] });

    const response = await request(app)
      .get("/api/plants/1")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`);
    expect(response.status).toBe(200);

    expect(response.body.records.id).toEqual(plants[0].id);
  });

  it("should return 404 if the plant doesn't exit", async () => {
    read.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/plants/100")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`);
    expect(response.status).toBe(404);
  });
});

describe.skip("POST /plants", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    getFirst.mockResolvedValue(MOCK_EXISTING_USER);
  });
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
    create.mockResolvedValue(mockPlant);

    const response = await request(app)
      .post("/api/plants")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`)
      .send(mockPlant);
    expect(response.status).toBe(201);

    expect(response.body).toEqual(mockPlant);
  });

  it("should return 204 if the payload is empty", async () => {
    const response = await request(app)
      .post("/api/plants")
      .set("Authorization", `Basic ${process.env.SECRET_HASH}`)
      .send({});
    expect(response.status).toBe(204);
  });
});

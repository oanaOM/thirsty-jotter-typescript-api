import request from "supertest";
import { app } from "../../app";
import {
  MOCK_EXISTING_USER,
  MOCK_USER_CREDENTIALS,
} from "../../../test/mocks/fixtures/users";

const create = vi.hoisted(() => vi.fn());
const getFirst = vi.hoisted(() => vi.fn());

vi.mock("../../xata", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../xata")>();
  return {
    ...mod,
    getXataClient: () => {
      return {
        db: {
          users: {
            filter: () => {
              return {
                getFirst,
              };
            },
            create,
          },
        },
      };
    },
  };
});

describe("POST /login", () => {
  describe("validates the params", () => {
    describe("should return 400", () => {
      afterEach(() => {
        vi.clearAllMocks();
      });
      it("when both params are missing", async () => {
        const response = await request(app).post("/api/login").send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(
          "Invalid params. Please specify your email and password"
        );
      });
      it("when one of the param is misspelled", async () => {
        const response = await request(app)
          .post("/api/login")
          .send({ pass: "123" });
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(
          "Invalid params. Please specify your email and password"
        );
      });
      it("when one of the param is missing", async () => {
        const response = await request(app)
          .post("/api/login")
          .send({ password: "123" });
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(
          "Invalid params. Please specify your email and password"
        );
      });
    });
  });

  describe("if the user exists", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("and it has a valid hash, then return the user object", async () => {
      getFirst.mockResolvedValue(MOCK_EXISTING_USER);
      const response = await request(app)
        .post("/api/login")
        .set("Accept", "application/json")
        .send(MOCK_USER_CREDENTIALS);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Welcome back user",
        email: MOCK_EXISTING_USER.email,
      });
    });
    it("and it has an invalid hash, return 402", async () => {
      getFirst.mockResolvedValue({
        ...MOCK_EXISTING_USER,
        hash: "too_small",
      });
      const response = await request(app)
        .post("/api/login")
        .send(MOCK_USER_CREDENTIALS);
      expect(response.statusCode).toBe(402);
      expect(response.body.error.message).toContain("User has invalid hash");
    });
  });

  describe("if the user doesn't exists", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("should create a new user", async () => {
      getFirst.mockResolvedValue(null);
      create.mockResolvedValue({
        email: "pluto@him.io",
        hash: "bla",
        id: "rec_cljmll37pk5is6u04r7g",
        salt: "bla",
        xata: {
          createdAt: "2023-11-29T16:46:12.381Z",
          updatedAt: "2023-11-29T16:46:12.381Z",
          version: 0,
        },
      });
      const response = await request(app)
        .post("/api/login")
        .send({ password: "123454", email: "pluto@him.io" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain({
        message: "YAY! User has been successfully created",
        email: "pluto@him.io",
      });
    });

    it("should return an error if user couldn't be created", async () => {
      getFirst.mockResolvedValue(null);
      create.mockImplementation(() => {
        return Promise.reject(
          new Error(
            "FetcherError: invalid record: column [email]: is not unique"
          )
        ).then(
          () => {
            // not called
          },
          (error) => {
            throw new Error(error); // Stacktrace
          }
        );
      });

      const response = await request(app)
        .post("/api/login")
        .send({ password: "123454", email: "pluto@him.io" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain({
        message: "Oops, something went wrong when creating the user in db",
      });
    });
    // it("should return 500 for any other error", () => {});
  });
});

/**
 * 
 * TODO: 
 * - validate that email is an email
 */


import request from "supertest";
import { app } from "../../app";
import {
  MOCK_EXISTING_USER,
  MOCK_USER,
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
          },
        },
      };
    },
  };
});

describe("POST /users", () => {
  describe("validates the params", () => {
    describe("should return 400", () => {
      afterEach(() => {
        vi.clearAllMocks();
      });
      it("when payload is missing", async () => {
        const response = await request(app).post("/api/users/validate").send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(
          "Invalid params. Please specify your email."
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
        .post("/api/users/validate")
        .set("Accept", "application/json")
        .send(MOCK_USER);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        user: {
          id: MOCK_EXISTING_USER.id,
          email: MOCK_EXISTING_USER.email,
        }
      });
    });
  });

  describe("if the user doesn't exists", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("should return 404", async () => {
      getFirst.mockResolvedValue(null);
      const response = await request(app)
        .post("/api/users/validate")
        .set("Accept", "application/json")
        .send(MOCK_USER);

      expect(response.statusCode).toBe(404);
      expect(response.body.error.message).toBe("User not found");
    });
    // it("should return 500 for any other error", () => {});
  });
});

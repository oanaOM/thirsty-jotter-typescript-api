import { Request, Response } from "express";
import { authMiddleware } from "./authorization";
import { MOCK_EXISTING_USER } from "../../test/mocks/fixtures/users";

const getFirst = vi.hoisted(() => vi.fn());

vi.mock("../xata", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../xata")>();
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

describe("Authorization middleware", () => {
  let mockNextFunction = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shouldn't pass with an missing token", async () => {
    const mockRequest = {
      headers: {},
    } as Request;
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as Partial<Response>;

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );

    expect(mockResponse.status).toBeCalledWith(403);
    expect(mockResponse.send).toBeCalledWith({
      error: "Forbidden. Missing token from the 'authorization' header",
    });
  });

  it("shouldn't pass with an invalid token", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer randomToken",
      },
    } as Partial<Request>;

    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as Partial<Response>;

    getFirst.mockResolvedValue(null);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );

    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.send).toBeCalledWith({ error: "User unauthorized" });
  });

  it("should pass with a valid token", async () => {
    const mockRequest = {
      headers: {
        authorization: `Bearer 232`,
      },
    } as Partial<Request>;

    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as Partial<Response>;

    getFirst.mockResolvedValue(MOCK_EXISTING_USER);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );

    expect(mockNextFunction).toBeCalledTimes(1);
  });
});

import { Request, Response } from "express";
import { sessionMiddleware } from "./session";

describe("Authorization middleware", () => {
    let mockNextFunction = vi.fn();

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should call next is cookie is present", async () => {
        const mockRequest = {
            headers: {
                "cookie": 'connect.sid=s%3AJYyRxxw4NJ9PX9CuEG7TnLZ2GPujJijL.AEljrXV0OCa92QLyYYHPIPcMOTJ5RFlq6SRvr5TEl5I'
            },
        } as Partial<Request>;

        const mockResponse = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        } as Partial<Response>;


        await sessionMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction
        );

        expect(mockNextFunction).toBeCalledTimes(1);
    });

    it("should return an error if session cookie is mission", async () => {
        const mockRequest = {
            headers: {},
        } as Partial<Request>;

        const mockResponse = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        } as Partial<Response>;


        await sessionMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction
        );

        expect(mockResponse.status).toBeCalledWith(440);
        expect(mockResponse.send).toBeCalledWith({ error: { message: "Session expired. Please login again." } });
    });
});

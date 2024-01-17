import { Response, Request, NextFunction } from "express";
import { ApiError, ApiResponse } from "../common/types";

export const sessionMiddleware = async (
    request: Request,
    response: Response<ApiResponse | ApiError>,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    next: NextFunction
    /* eslint-enable @typescript-eslint/no-unused-vars */
) => {

    console.info("Session middleware: request coming through with session", request.session)
    if (request.headers.cookie && request.headers.cookie?.length > 0 || request.session) {
        next()
    } else {
        console.info("Path: ", request.path)
        console.info("Session middleware - cookie session is missing/expired ",)
        response.status(440).send({
            error: {
                message: "Session expired. Please login again."
            },
        });
    }
};

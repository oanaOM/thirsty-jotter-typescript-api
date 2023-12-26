import { Users } from "../xata";

export type StatusCodes = 200 | 400 | 402 | 404 | 500;

export interface ApiResponse {
    status: StatusCodes,
    user: Users,
    message: string,
}

export interface ApiError {
    error: Omit<Error, "name">,
}
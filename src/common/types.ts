import { Users } from "../xata";

// 401 - Unauthorized
// 403 Forbidden
export type StatusCodes = 200 | 400 | 402 | 401 | 404 | 500;

export interface ApiResponse {
    status: StatusCodes,
    user: Users,
    message: string,
}

export interface ApiError {
    error: Omit<Error, "name">,
}

export interface ApiAuthResponse extends ApiResponse {
    auth: {
        expiryDate: Date | null | undefined;
    }
}
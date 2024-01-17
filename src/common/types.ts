import { Plants, Users } from "../xata";

// 401 - Unauthorized
// 403 Forbidden
export type StatusCodes = 200 | 201 | 204 | 400 | 402 | 401 | 404 | 500;

export interface ApiResponse {
    status: StatusCodes,
    message: string,
}

export interface ApiResponseUser extends ApiResponse {
    user: Users,
}

export interface ApiResponsePlant extends ApiResponse {
    plants: Plants[],
}

export interface ApiError {
    error: Omit<Error, "name">,
}

export interface ApiAuthResponse extends ApiResponseUser {
    auth: {
        expiryDate: Date | null | undefined;
    }
}
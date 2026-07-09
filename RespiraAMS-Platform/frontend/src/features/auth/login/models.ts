export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    token: string;
    refreshToken: string;
}
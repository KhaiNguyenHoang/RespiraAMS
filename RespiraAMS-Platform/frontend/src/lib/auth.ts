import { ApiResult } from "./models";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "1.0";
const API_BASE = `/api/${API_VERSION}`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    token: string;
    refreshToken: string;
}

const ACCESS_TOKEN_KEY = "respira_access_token";
const REFRESH_TOKEN_KEY = "respira_refresh_token";
const USER_KEY = "respira_user";

export async function login(request: LoginRequest): Promise<UserData> {
    const email = request.email?.trim() ?? "";
    const password = request.password?.trim() ?? "";

    if (!email || !password) {
        throw new Error("Email và mật khẩu không được để trống.");
    }

    const response = await fetch(`${API_BASE}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = (await response.json().catch(() => null)) as ApiResult<UserData> | null;

    if (!response.ok || !result?.success || !result.data) {
        throw new Error(result?.message ?? "Email hoặc mật khẩu không đúng.");
    }

    saveTokens(result.data.token, result.data.refreshToken);
    saveUser(result.data);
    return result.data;
}

export function saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveUser(user: UserData): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): UserData | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as UserData;
    } catch {
        return null;
    }
}

export function clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
    return !!getAccessToken();
}

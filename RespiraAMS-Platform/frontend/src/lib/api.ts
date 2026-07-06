import logger from "./logger";
import { ApiResult } from "./models";
import { getAccessToken, refreshSession, clearAuth } from "./auth";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "1.0";

/** Client-side base path — Next.js rewrites proxy this to the gateway */
export const API_BASE = `/api/${API_VERSION}`;


/** Server-side full URL — used in API routes to reach the backend directly */
export const API_BASE_SERVER = `${process.env.GATEWAY_URL || "http://gateway"}/api/${API_VERSION}`;

function redirectToLogin(): void {
    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}

async function handle401(): Promise<boolean> {
    const refreshed = await refreshSession();
    if (!refreshed) {
        clearAuth();
        redirectToLogin();
        return false;
    }
    return true;
}

export async function apiFetch<T>(
    url: string,
    opts?: RequestInit,
    withAuth: boolean = true
): Promise<T | null> {
    const isFormData = opts?.body instanceof FormData;
    const headers = new Headers(opts?.headers);

    if (withAuth) {
        const token = getAccessToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const resp = await fetch(url, {
        headers,
        ...opts,
    });

    if (resp.status === 204) {
        return null as T;
    }

    const result = (await resp.json()) as ApiResult<T>;

    if (!result.success) {
        logger.error("Failed to make API request", { url, message: result.message });

        switch (result.statusCode) {
            case 400:
                throw Error(result.message as string);
            case 401: {
                const recovered = await handle401();
                if (recovered) {
                    return apiFetch<T>(url, opts, withAuth);
                }
                throw Error("Session expired. Please log in again.");
            }
            case 403:
                throw Error("You cannot access this resource");
            case 404:
                throw Error(result.message as string);
            case 500:
                throw Error("Internal server error");
            case 503:
                throw Error("Service temporarily unavailable");
        }

        throw Error(result.message || "An unexpected error occurred");
    }

    return result.data;
}

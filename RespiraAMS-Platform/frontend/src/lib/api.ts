import logger from "./logger";

export interface ApiResult<T> {
    statusCode: number;
    success: boolean;
    message: string | null;
    data: T | null;
}

export async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T | null> {
    // Make API request 
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        ...opts,
    })

    // Get API result
    const result = await resp.json() as ApiResult<T>;

    // If failed, log error and throw 
    if (!result.success) {
        logger.error("Failed to make API request", { "url": url, "message": result.message });
        throw Error();
    }

    return result.data;
}
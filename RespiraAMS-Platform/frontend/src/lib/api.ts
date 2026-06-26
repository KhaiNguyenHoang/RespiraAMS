import logger from "./logger";
import { ApiResult } from "./models";

export const API_BASE = "/api/1.0";

export async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T | null> {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        ...opts,
    })

    const result = await resp.json() as ApiResult<T>;

    if (!result.success) {
        logger.error("Failed to make API request", { "url": url, "message": result.message });
        throw Error();
    }

    return result.data;
}

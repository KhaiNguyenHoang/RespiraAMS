import logger from "./logger";
import { ApiResult } from "./models";

export const API_BASE = "/api/1.0";

export async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T | null> {
    const isFormData = opts?.body instanceof FormData;
    const headers = new Headers(opts?.headers);
    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const resp = await fetch(url, {
        headers: headers,
        ...opts,
    })

    if (resp.status === 204) {
        return null as T;
    }

    const result = await resp.json() as ApiResult<T>;

    if (!result.success) {
        logger.error("Failed to make API request", { "url": url, "message": result.message });
        throw Error();
    }

    return result.data;
}

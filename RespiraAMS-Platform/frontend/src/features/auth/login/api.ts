import { API_BASE } from "@/lib/api";
import { LoginRequest, LoginResponse } from "./models";

export async function loginApi(request: LoginRequest): Promise<LoginResponse> {
    const resp = await fetch(`${API_BASE}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const result = await resp.json();

    if (!resp.ok || !result.success) {
        throw new Error(result.message || "Login failed");
    }

    return result.data as LoginResponse;
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { API_BASE_SERVER } from "@/lib/api";

export async function POST() {
    try {
        const session = await getSession();

        if (!session.refreshToken) {
            return NextResponse.json(
                { statusCode: 401, success: false, message: "No refresh token available", data: null },
                { status: 401 }
            );
        }

        // -------------------------------------------------------
        // TODO: Replace with real backend refresh endpoint, e.g.:
        //
        // const resp = await fetch(`${API_BASE_SERVER}/Auth/refresh`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ refreshToken: session.refreshToken }),
        // });
        // const result = await resp.json();
        //
        // if (resp.ok && result.success) {
        //     session.accessToken = result.data.token;
        //     if (result.data.refreshToken) {
        //         session.refreshToken = result.data.refreshToken;
        //     }
        //     await session.save();
        //
        //     return NextResponse.json({
        //         statusCode: 200,
        //         success: true,
        //         message: null,
        //         data: { accessToken: result.data.token },
        //     });
        // }
        // -------------------------------------------------------

        // Mock: return failure — triggers redirect to login
        return NextResponse.json(
            { statusCode: 401, success: false, message: "Token refresh not available", data: null },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { statusCode: 500, success: false, message: "Internal server error", data: null },
            { status: 500 }
        );
    }
}

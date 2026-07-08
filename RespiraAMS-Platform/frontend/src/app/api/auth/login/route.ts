import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { API_BASE_SERVER } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { statusCode: 400, success: false, message: "Email and password are required", data: null },
                { status: 400 }
            );
        }

        const resp = await fetch(`${API_BASE_SERVER}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await resp.json();

        if (!resp.ok || !result.success) {
            return NextResponse.json(
                { statusCode: result.statusCode ?? resp.status, success: false, message: result.message ?? "Login failed", data: null },
                { status: resp.status }
            );
        }

        const data = result.data;

        const session = await getSession();
        session.id = data.id;
        session.firstName = data.firstName;
        session.lastName = data.lastName;
        session.email = data.email;
        session.phoneNumber = data.phoneNumber;
        session.role = data.role;
        session.accessToken = data.token;
        session.refreshToken = data.refreshToken;
        await session.save();

        return NextResponse.json({
            statusCode: 200,
            success: true,
            message: null,
            data: {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                role: data.role,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { statusCode: 500, success: false, message: "Internal server error", data: null },
            { status: 500 }
        );
    }
}

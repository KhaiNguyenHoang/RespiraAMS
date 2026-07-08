import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
    try {
        const session = await getSession();

        if (!session.accessToken) {
            return NextResponse.json(
                { statusCode: 401, success: false, message: "Not authenticated", data: null },
                { status: 401 }
            );
        }

        return NextResponse.json({
            statusCode: 200,
            success: true,
            message: null,
            data: {
                id: session.id,
                firstName: session.firstName,
                lastName: session.lastName,
                email: session.email,
                phoneNumber: session.phoneNumber,
                role: session.role,
                accessToken: session.accessToken,
            },
        });
    } catch {
        return NextResponse.json(
            { statusCode: 500, success: false, message: "Internal server error", data: null },
            { status: 500 }
        );
    }
}

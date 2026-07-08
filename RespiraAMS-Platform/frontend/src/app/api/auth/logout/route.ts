import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
    try {
        const session = await getSession();
        session.destroy();
        return NextResponse.json({
            statusCode: 200,
            success: true,
            message: "Logged out successfully",
            data: null,
        });
    } catch {
        return NextResponse.json(
            { statusCode: 500, success: false, message: "Internal server error", data: null },
            { status: 500 }
        );
    }
}

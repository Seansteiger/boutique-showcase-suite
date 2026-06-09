import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { type, productId } = await req.json();

        if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

        // Mocked success response to satisfy track triggers (e.g. view, cart add) without requiring Supabase database
        return NextResponse.json({ success: true, type, productId });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
    }
}

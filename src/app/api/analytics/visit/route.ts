import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { visitorId, pagePath } = await req.json();

        if (!visitorId || !pagePath) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Mocked success response to satisfy analytics client without requiring Supabase database
        return NextResponse.json({ success: true, message: "Logged locally in mock session." });
    } catch (error) {
        console.error("Visit Tracker Exception:", error);
        return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
    }
}

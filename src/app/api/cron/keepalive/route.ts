import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Perform a lightweight query in Convex to verify database is awake
        const products = await convex.query(api.products.getProducts);

        return NextResponse.json({ 
            message: "Database keepalive ping successful.",
            productCount: products.length
        });
    } catch (err: any) {
        console.error("Keepalive Exception:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

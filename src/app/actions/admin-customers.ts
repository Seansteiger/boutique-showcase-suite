"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function getCustomers() {
    try {
        const profiles = await convex.query(api.profiles.getAllProfiles);
        
        // Map to format that the admin customers list expects
        const customers = profiles.map((p) => {
            let email = "customer@scented.co";
            if (p.userId.includes("admin")) {
                email = "admin@scented.co";
            } else if (p.userId.includes("manager")) {
                email = "manager@scented.co";
            }
            return {
                id: p.userId,
                email: email,
                full_name: p.fullName || "Valued Customer",
                role: p.role || 'customer',
                created_at: new Date(p.updatedAt).toISOString(),
                last_sign_in: new Date(p.updatedAt).toISOString(),
            };
        });

        return { customers, error: null };
    } catch (err: any) {
        console.error("Server action error:", err);
        return { error: err.message, customers: [] };
    }
}

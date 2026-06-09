"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function processYocoPayment(token: string, amountInCents: number, orderId: string) {
    try {
        // Fetch Settings dynamically from Convex
        const settings = await convex.query(api.settings.get);
        const secretKey = settings?.yocoSecretKey || process.env.YOCO_SECRET_KEY;

        if (!secretKey) {
            return { error: "Yoco Secret Key is missing. Please configure it in store settings." };
        }

        // 1. Charge the Card via Yoco API
        const apiUrl = "https://online.yoco.com/v1/charges/";

        console.log("Attempting Yoco Charge at:", apiUrl);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Secret-Key": secretKey,
            },
            body: JSON.stringify({
                token: token,
                amountInCents: amountInCents,
                currency: "ZAR",
                metadata: {
                    orderId: orderId,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Yoco Charge Failed:", data);
            return { error: data.displayMessage || "Payment failed." };
        }

        if (data.status === "successful") {
            // 2. Update Order to Paid in Convex
            await convex.mutation(api.orders.updateOrderStatus, {
                id: orderId,
                status: "paid",
                paymentId: data.id,
            });

            return { success: true };
        } else {
            return { error: "Payment was declined or failed." };
        }

    } catch (err: any) {
        console.error("Yoco Action Error:", err);
        return { error: "An internal server error occurred: " + err.message };
    }
}


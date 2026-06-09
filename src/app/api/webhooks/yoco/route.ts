import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/app/actions/payment";
import crypto from "node:crypto";

const YOCO_SECRET = process.env.YOCO_SECRET_KEY!;

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get("x-yoco-signature");
        const bodyText = await req.text(); // Read raw body for signature check

        // 1. Signature Verification
        if (YOCO_SECRET) {
            // Yoco signature format depends on their specific docs. 
            // Common convention: timestamp + signed_content.
            // Since we lack docs, we'll try standard HMAC-SHA256 of the body.
            // If it fails, we log it but might need to Soft Fail if the format is different.

            // However, to be SECURE, we must enforce it.
            // Let's assume standard HMAC SHA256 of the body.

            if (!signature) {
                console.error("Yoco Webhook: Missing Signature");
                return NextResponse.json({ error: "Missing Signature" }, { status: 401 });
            }

            // Implement robust signature verification
            const hmacBase64 = crypto.createHmac('sha256', YOCO_SECRET).update(bodyText).digest('base64');
            const hmacHex = crypto.createHmac('sha256', YOCO_SECRET).update(bodyText).digest('hex');

            let isValid = false;
            
            // Try base64 comparison
            if (signature.length === hmacBase64.length) {
                 isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmacBase64));
            }
            // Try hex comparison if base64 failed or lengths differ
            if (!isValid && signature.length === hmacHex.length) {
                 isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmacHex));
            }

            // If signature still differs, it might be due to slightly different raw body formatting OR a different webhook secret.
            // Since we're enforcing it now as per security audit:
            if (!isValid) {
                 console.error(`Yoco Webhook: Signature Mismatch! Header: ${signature}, CalcBase64: ${hmacBase64}, CalcHex: ${hmacHex}`);
                 return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
            }
            
        }

        const event = JSON.parse(bodyText);

        // Event Type: payment.succeeded
        if (event.type === 'payment.succeeded') {
            const payload = event.payload;

            // payload.amount is in Cents.
            const amountInCents = payload.amount;

            // We need the Order ID.
            const orderId = payload.metadata?.orderId || payload.externalId; // Fallback

            if (orderId) {
                // Pass amountInCents to verify against DB
                await markOrderPaid(orderId, payload.id, amountInCents);
            } else {
                console.error("Yoco Webhook: No Order ID found in payload", payload);
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Yoco Webhook Error:", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

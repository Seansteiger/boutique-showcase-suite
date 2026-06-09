"use server";

import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { sendWhatsAppOtp } from "@/lib/whatsapp";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

// Mock accounts for boutique profiles
const MOCK_ACCOUNTS = [
    {
        email: "admin@scented.co",
        password: "admin",
        fullName: "Aura Director (Super Admin)",
        role: "admin",
        userId: "admin-user-id-12345",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
        email: "manager@scented.co",
        password: "manager",
        fullName: "Boutique Manager",
        role: "manager",
        userId: "manager-user-id-67890",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
    },
    {
        email: "customer@scented.co",
        password: "customer",
        fullName: "Valued Customer",
        role: "customer",
        userId: "customer-user-id-abcde",
        avatarUrl: null
    },
    {
        email: "wholesale@scented.co",
        password: "wholesale",
        fullName: "Artisanal Spas SA (Wholesale Stockist)",
        role: "wholesale_stockist",
        userId: "wholesale-user-id-9999",
        avatarUrl: null
    }
];

export async function loginUser(email: string, password: string) {
    if (!email || !password) {
        return { error: "Please fill in all fields" };
    }

    const account = MOCK_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);

    if (!account) {
        return { error: "Invalid email or password" };
    }

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", JSON.stringify({
        id: account.userId,
        email: account.email,
        name: account.fullName,
        role: account.role,
        avatarUrl: account.avatarUrl
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
    });

    return {
        success: true,
        user: {
            id: account.userId,
            email: account.email,
            name: account.fullName,
            role: account.role
        }
    };
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    return { success: true };
}

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;

    if (!email || !fullName) {
        return { error: "All fields are required" };
    }

    // Set customer cookie directly for registration bypass
    const cookieStore = await cookies();
    cookieStore.set("auth_session", JSON.stringify({
        id: "customer-user-id-" + Math.random().toString(36).substring(2, 9),
        email: email,
        name: fullName,
        role: "customer",
        avatarUrl: null
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });

    return {
        success: true,
        message: "Registration successful!"
    };
}

export async function requestWhatsAppOtp(phone: string) {
    if (!phone) {
        return { error: "Please enter your phone number." };
    }

    try {
        // 1. Invoke Convex mutation to generate code
        const result = await convex.mutation(api.otp.generateOtp, { phone });
        
        if (!result.success || !result.phone || !result.code) {
            return { error: result.error || "Failed to generate verification code." };
        }

        // 2. Fetch current settings to style the WhatsApp notification
        const settings = await convex.query(api.settings.get);
        const storeName = settings?.brandName || "SCENTED";

        // 3. Send mock WhatsApp verification message
        const sent = await sendWhatsAppOtp(result.phone, result.code, storeName);
        
        if (!sent) {
            return { error: "Failed to dispatch verification code via WhatsApp." };
        }

        return {
            success: true,
            phone: result.phone,
            message: `A 6-digit OTP verification code has been dispatched to ${result.phone} via WhatsApp.`,
            devCode: result.code // Handed back in dev environment so UI can display it
        };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred. Please try again." };
    }
}

export async function verifyWhatsAppOtp(phone: string, code: string, fullName?: string) {
    if (!phone || !code) {
        return { error: "Phone number and verification code are required." };
    }

    try {
        // 1. Verify code in Convex database
        const result = await convex.mutation(api.otp.verifyOtpCode, { phone, code, fullName });

        if (!result.success || !result.user) {
            return { error: result.error || "Verification failed." };
        }

        // 2. Set dynamic HTTP-Only auth session cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_session", JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            name: result.user.fullName,
            role: result.user.role,
            phone: result.user.phone,
            avatarUrl: null
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        });

        return {
            success: true,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.fullName,
                role: result.user.role,
                phone: result.user.phone
            }
        };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred during verification." };
    }
}

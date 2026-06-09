import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, ""); // Keep only digits
  if (cleaned.startsWith("0")) {
    cleaned = "27" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("+") && cleaned.length > 0) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

// 1. Generate OTP and store it
export const generateOtp = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const normalizedPhone = normalizePhoneNumber(args.phone);
    if (!normalizedPhone || normalizedPhone.length < 9) {
      return { success: false, error: "Please enter a valid phone number." };
    }

    // Generate secure 6-digit code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    // Purge old OTP records for this phone number
    const existingOtps = await ctx.db
      .query("otp_codes")
      .withIndex("by_phone", (q) => q.eq("phone", normalizedPhone))
      .collect();

    for (const otp of existingOtps) {
      await ctx.db.delete(otp._id);
    }

    // Insert new OTP record
    await ctx.db.insert("otp_codes", {
      phone: normalizedPhone,
      code: generatedCode,
      expiresAt: expiresAt,
    });

    return {
      success: true,
      phone: normalizedPhone,
      code: generatedCode,
    };
  },
});

// 2. Verify OTP code and return/create profile
export const verifyOtpCode = mutation({
  args: { phone: v.string(), code: v.string(), fullName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const normalizedPhone = normalizePhoneNumber(args.phone);

    // Fetch active OTP record for this number
    const activeOtp = await ctx.db
      .query("otp_codes")
      .withIndex("by_phone", (q) => q.eq("phone", normalizedPhone))
      .first();

    if (!activeOtp) {
      return { success: false, error: "No verification code has been requested for this number." };
    }

    if (activeOtp.code !== args.code) {
      return { success: false, error: "The verification code you entered is invalid." };
    }

    if (Date.now() > activeOtp.expiresAt) {
      // Clean it up anyway to free memory
      await ctx.db.delete(activeOtp._id);
      return { success: false, error: "This verification code has expired. Please request a new one." };
    }

    // Purge the valid OTP record immediately to prevent replay
    await ctx.db.delete(activeOtp._id);

    // Look up profile by phone number using index 'by_phone'
    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_phone", (q) => q.eq("phone", normalizedPhone))
      .first();

    if (!profile) {
      // If profile doesn't exist, create a new customer account
      const generatedUserId = "customer-otp-" + Math.random().toString(36).substring(2, 9);
      
      const newProfileId = await ctx.db.insert("profiles", {
        userId: generatedUserId,
        role: "customer",
        fullName: args.fullName || "Valued Customer",
        phone: normalizedPhone,
        updatedAt: Date.now(),
      });

      profile = await ctx.db.get(newProfileId);
    } else if (args.fullName) {
      // If profile exists and custom name is provided, patch it!
      await ctx.db.patch(profile._id, {
        fullName: args.fullName,
        updatedAt: Date.now(),
      });
      profile.fullName = args.fullName;
    }

    if (!profile) {
      return { success: false, error: "Failed to establish user account. Please try again." };
    }

    // Return the user profile data
    return {
      success: true,
      user: {
        id: profile.userId,
        email: profile.userId.includes("admin") 
          ? "admin@scented.co" 
          : (profile.userId.includes("manager") ? "manager@scented.co" : "customer@scented.co"),
        fullName: profile.fullName || "Valued Customer",
        role: profile.role,
        phone: profile.phone,
      },
    };
  },
});

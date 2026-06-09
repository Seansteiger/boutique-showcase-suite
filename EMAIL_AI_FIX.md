# Email & AI System Configuration Guide

## Problem Summary
1. **User Registration/Password Reset Emails Not Sending**
2. **Admin AI Product Refine Not Working**

---

## Solutions

### 1. Fix Email System (Supabase Native)

Registration and password reset emails are handled by **Supabase Auth**, not Resend. You need to configure Supabase:

#### Step 1: Configure Supabase Email Settings

1. Go to: https://supabase.com/dashboard/project/etargayvjbhxthzpwmno/auth/templates
2. Navigate to **Authentication → Email Templates**
3. Update these templates:

**Confirm Signup Template:**
```html
<h2>Confirm your signup</h2>
<p>Welcome to Jozi Student Hub!</p>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**Reset Password Template:**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

#### Step 2: Set Site URL in Supabase

1. Go to: https://supabase.com/dashboard/project/etargayvjbhxthzpwmno/auth/url-configuration
2. Set **Site URL** to: `https://jozistudenthub.co.za`
3. Add **Redirect URLs**:
   - `https://jozistudenthub.co.za/auth/callback`
   - `https://jozistudenthub.co.za/auth/update-password`

#### Step 3: Verify SMTP Settings (Important!)

Supabase Free Tier has email sending limits:
- **30 emails per hour**
- For production, you may need to configure custom SMTP

To use custom SMTP (Resend):
1. Go to: https://supabase.com/dashboard/project/etargayvjbhxthzpwmno/settings/auth
2. Scroll to **SMTP Settings**
3. Configure:
   - **Sender email**: `orders@jozistudenthub.co.za`
   - **SMTP Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Username**: `resend`
   - **Password**: Your `RESEND_API_KEY` (re_BscFtcnN_JTe9yvs2jrYmSbYfLPaEfAJx)

---

### 2. Fix Admin AI (Add GEMINI_API_KEY to Vercel)

The admin "Refine with AI" feature requires the Gemini API key.

#### Add to Vercel Environment Variables:

1. Go to: https://vercel.com/Seansteiger/jsh-store/settings/environment-variables
2. Add two variables:

**Variable 1:**
- **Key**: `GEMINI_API_KEY`
- **Value**: Your Google Gemini API key (starts with `AIza...`)
- **Environments**: Production, Preview, Development

**Variable 2 (if not already added):**
- **Key**: `RESEND_API_KEY`
- **Value**: `re_BscFtcnN_JTe9yvs2jrYmSbYfLPaEfAJx`
- **Environments**: Production, Preview, Development

After adding, Vercel will auto-redeploy (~2 minutes).

---

## Testing Checklist

### Email System
- [ ] Register a new account
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] Try "Forgot Password" flow
- [ ] Check email for reset link
- [ ] Complete password reset

### Admin AI
- [ ] Log in to admin dashboard
- [ ] Go to Products → Edit any product
- [ ] Click "Refine with AI" button (✨ icon)
- [ ] Verify AI enhances title, description, and features

---

## Quick Fix Summary

**For Emails:**
- Configure Supabase Auth templates and Site URL (steps above)
- Optionally add Resend SMTP for higher limits

**For Admin AI:**
- Add `GEMINI_API_KEY` to Vercel environment variables

No code changes needed! Just configuration.

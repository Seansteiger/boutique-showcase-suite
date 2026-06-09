/**
 * Premium WhatsApp Notification & Cart Recovery API Connector
 * 
 * Provides automated conversational recovery alerts using local South African
 * API services (e.g. Twilio, Wati, or Chat-API). Handles fallbacks gracefully.
 */

export interface WhatsAppPayload {
  to: string;
  customerName: string;
  storeName: string;
  itemsSummary: string;
  checkoutUrl: string;
  couponCode: string;
}

export async function sendWhatsAppRecovery(payload: WhatsAppPayload): Promise<boolean> {
  const { to, customerName, storeName, itemsSummary, checkoutUrl, couponCode } = payload;
  
  // Clean phone number (South African country code formatting e.g. +27)
  let cleanPhone = to.replace(/[^\d]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "27" + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith("27") && cleanPhone.length === 9) {
    cleanPhone = "27" + cleanPhone;
  }

  // Tailor conversational copywriting copy based on store name
  let message = "";
  if (storeName.toUpperCase().includes("SCENTED")) {
    message = `✨ *${storeName}* \n\n` +
      `Dear ${customerName},\n\n` +
      `We noticed you left some exquisite items in your cart:\n` +
      `📦 _${itemsSummary}_\n\n` +
      `Olfactory balance shouldn't wait. We have saved your selection and created an exclusive *10% savings coupon* valid for 24 hours: *${couponCode}*.\n\n` +
      `Click the link below to check out instantly:\n` +
      `🔗 ${checkoutUrl}\n\n` +
      `With warm botanical regards,\n` +
      `The Scented Curation Team`;
  } else if (storeName.toUpperCase().includes("SLATE")) {
    message = `⚡ *${storeName}* \n\n` +
      `Hey ${customerName},\n\n` +
      `Your minimalist gear selection is locked and saved:\n` +
      `📦 _${itemsSummary}_\n\n` +
      `Upgrade your workflow today. We generated a limited *10% off express pass* for your order: *${couponCode}*.\n\n` +
      `Complete your setup instantly here:\n` +
      `🔗 ${checkoutUrl}\n\n` +
      `Stay productive,\n` +
      `Slate & Co Support`;
  } else if (storeName.toUpperCase().includes("L'ARTELIER") || storeName.toUpperCase().includes("ARTELIER")) {
    message = `🖤 *L'ARTELIER* \n\n` +
      `Hello ${customerName},\n\n` +
      `Your haute couture pieces have been reserved in our private vault:\n` +
      `📦 _${itemsSummary}_\n\n` +
      `Do not compromise on your aesthetic. Enjoy a privileged *10% custom savings invitation* (valid for 24 hours): *${couponCode}*.\n\n` +
      `Secure your curation instantly:\n` +
      `🔗 ${checkoutUrl}\n\n` +
      `L'Artelier Registry`;
  } else if (storeName.toUpperCase().includes("OASIS")) {
    message = `🌿 *OASIS CO* \n\n` +
      `Hi ${customerName},\n\n` +
      `Your handcrafted earth-fired items are waiting for a home:\n` +
      `📦 _${itemsSummary}_\n\n` +
      `We shaped these curations with soul. To help you welcome them home, here is a *10% artisanal discount code*: *${couponCode}*.\n\n` +
      `Collect your items and checkout here:\n` +
      `🔗 ${checkoutUrl}\n\n` +
      `Oasis Co. shaped by earth.`;
  } else {
    message = `🌊 *OCEAN MIST* \n\n` +
      `Hey ${customerName},\n\n` +
      `Your coastal activewear and wellness items are saved in your locker:\n` +
      `📦 _${itemsSummary}_\n\n` +
      `Start fresh today. We generated a *10% summer checkout coupon* for your items: *${couponCode}*.\n\n` +
      `Rejuvenate and check out now:\n` +
      `🔗 ${checkoutUrl}\n\n` +
      `Ocean Mist Refresh Team`;
  }

  console.log(`\n============== [OUTGOING WHATSAPP API GATEWAY REQUEST] ==============`);
  console.log(`Recipient: +${cleanPhone}`);
  console.log(`Message Length: ${message.length} characters`);
  console.log(`---------------- Message Content ----------------`);
  console.log(message);
  console.log(`======================================================================\n`);

  // Call Twilio / Wati API if keys configured
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const fromPhone = process.env.WHATSAPP_PHONE_NUMBER;

  if (apiToken && fromPhone) {
    try {
      const res = await fetch(`https://api.wati.io/api/v1/sendSessionMessage/${cleanPhone}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messageText: message })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to post message to Wati API:", e);
      return false;
    }
  }

  // Graceful fallback for local development: simulation succeeds
  return true;
}

export async function sendWhatsAppOtp(to: string, code: string, storeName: string): Promise<boolean> {
  // Clean phone number (South African country code formatting e.g. +27)
  let cleanPhone = to.replace(/[^\d]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "27" + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith("27") && cleanPhone.length === 9) {
    cleanPhone = "27" + cleanPhone;
  }

  // Tailor conversational OTP text copy based on store name
  let message = "";
  const uppercaseStore = storeName.toUpperCase();
  if (uppercaseStore.includes("SCENTED")) {
    message = `✨ *${storeName} Verification*\n\n` +
      `Your verification code is: *${code}*\n\n` +
      `It is valid for 5 minutes. Do not share this code with anyone.\n\n` +
      `With warm botanical regards,\n` +
      `The Scented Curation Team`;
  } else if (uppercaseStore.includes("SLATE")) {
    message = `⚡ *${storeName} Verification*\n\n` +
      `Your workflow verification code is: *${code}*\n\n` +
      `Valid for 5 minutes. Keep this secure.\n\n` +
      `Stay productive,\n` +
      `Slate & Co Support`;
  } else if (uppercaseStore.includes("L'ARTELIER") || uppercaseStore.includes("ARTELIER")) {
    message = `🖤 *L'ARTELIER Registry Verification*\n\n` +
      `Your private invitation code is: *${code}*\n\n` +
      `Valid for 5 minutes only.\n\n` +
      `L'Artelier Registry`;
  } else if (uppercaseStore.includes("OASIS")) {
    message = `🌿 *OASIS CO Verification*\n\n` +
      `Your earth-fired verification code is: *${code}*\n\n` +
      `Expires in 5 minutes.\n\n` +
      `Oasis Co. shaped by earth.`;
  } else {
    message = `🌊 *OCEAN MIST Verification*\n\n` +
      `Your dynamic access code is: *${code}*\n\n` +
      `It is valid for 5 minutes.\n\n` +
      `Ocean Mist Refresh Team`;
  }

  console.log(`\n============== [OUTGOING WHATSAPP OTP AUTH CODE] ==============`);
  console.log(`Recipient: +${cleanPhone}`);
  console.log(`Verification Code: ${code}`);
  console.log(`Message Content:`);
  console.log(message);
  console.log(`================================================================\n`);

  // Call Twilio / Wati API if keys configured
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const fromPhone = process.env.WHATSAPP_PHONE_NUMBER;

  if (apiToken && fromPhone) {
    try {
      const res = await fetch(`https://api.wati.io/api/v1/sendSessionMessage/${cleanPhone}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messageText: message })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to post OTP to Wati API:", e);
      return false;
    }
  }

  return true;
}

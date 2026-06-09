import { Resend } from 'resend';

// Initialize Resend with API Key (defaults to empty string to prevent crash on missing env)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');

export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
        console.warn("[EMAIL WARNING] RESEND_API_KEY is missing. Email logged to console.");
        console.log(`[EMAIL MOCK] To: ${payload.to} | Subject: ${payload.subject}`);
        return true;
    }

    try {
        const data = await resend.emails.send({
            from: 'Jozi Student Hub <info@jozistudenthub.co.za>',
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return false;
        }

        console.log("Email sent successfully:", data.data?.id);
        return true;
    } catch (error) {
        console.error("Email Sending Failed:", error);
        return false;
    }
}

// Helper to format currency
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);

interface ReceiptData {
    orderId: string;
    customerName: string;
    customerEmail: string;
    date: Date;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
    shippingAddress: {
        address: string;
        city: string;
    };
    paymentMethod: string;
    isAdmin: boolean;
}

export function generateReceiptEmail(data: ReceiptData) {
    const { orderId, customerName, date, items, subtotal, shipping, total, shippingAddress, paymentMethod, isAdmin, customerEmail } = data;

    // Logo URL - Ensure this is publicly accessible
    const logoUrl = "https://jozistudenthub.co.za/images/logo.png"; // Fallback if specific one needed

    const formattedDate = date.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' });

    const headerTitle = isAdmin ? `New order: #${orderId.slice(0, 8)}` : `Order Confirmed: #${orderId.slice(0, 8)}`;
    const subHeader = isAdmin
        ? `You've received a new order from ${customerName}:`
        : `Thanks for your order, ${customerName}! Here are the details:`;

    // Generate Items Rows
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                <img src="${item.image}" alt="${item.name}" width="64" height="64" style="border-radius: 4px; object-fit: cover; background: #333;" />
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #333; color: #fff; font-family: 'Courier New', Courier, monospace;">
                ${item.name}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #333; color: #fff; text-align: center; font-family: 'Courier New', Courier, monospace;">
                x${item.quantity}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #333; color: #fff; text-align: right; font-family: 'Courier New', Courier, monospace;">
                ${formatCurrency(item.price)}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
            body { background-color: #0f1115; color: #ffffff; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0f1115; padding: 20px; }
            a { color: #8b5cf6; text-decoration: none; }
            h1 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 10px; color: #ffffff; letter-spacing: 1px; }
            h2 { font-family: 'Playfair Display', serif; font-size: 20px; margin-top: 30px; margin-bottom: 15px; color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 10px; }
            .totals-table td { padding: 5px 0; color: #ffffff; }
            .totals-table .total-row td { font-weight: bold; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; }
            .address-block { margin-top: 30px; font-size: 14px; line-height: 1.6; color: #e5e7eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://jozistudenthub.co.za/images/logo.png" alt="Jozi Student Hub" width="200" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
            </div>

            <h1>${headerTitle}</h1>
            <p style="color: #a1a1aa; margin-top: 0;">${subHeader}</p>

            ${isAdmin ? `
            <div style="margin: 20px 0;">
                <h2 style="border: none; margin-bottom: 5px;">Order summary</h2>
                <div style="color: #8b5cf6;">Order #${orderId.slice(0, 8)} <span style="color: #666;">(${formattedDate})</span></div>
            </div>
            ` : ''}

            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                ${itemsHtml}
            </table>

            <table width="100%" cellspacing="0" cellpadding="0" class="totals-table" style="margin-top: 20px;">
                <tr>
                    <td style="text-align: right; width: 80%; padding-right: 20px;">Subtotal:</td>
                    <td style="text-align: right;">${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                    <td style="text-align: right; width: 80%; padding-right: 20px;">Shipping:</td>
                    <td style="text-align: right;">${formatCurrency(shipping)}</td>
                </tr>
                <tr class="total-row">
                    <td style="text-align: right; width: 80%; padding-right: 20px;">Total:</td>
                    <td style="text-align: right;">${formatCurrency(total)}</td>
                </tr>
                <tr>
                    <td style="text-align: right; width: 80%; padding-right: 20px; padding-top: 10px;">Payment method:</td>
                    <td style="text-align: right; padding-top: 10px;">${paymentMethod}</td>
                </tr>
            </table>

            <div class="address-block">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 16px; margin-bottom: 10px; color: #fff;">
                    ${shippingAddress.address.includes('[Collection]') ? 'Collection details' : 'Billing address'}
                </h3>
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">${customerName}</div>
                <div>${shippingAddress.address}</div>
                ${!shippingAddress.address.includes('[Collection]') ? `<div>${shippingAddress.city}</div>` : ''}
                <div style="margin-top: 10px;"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
            </div>

            <div style="margin-top: 40px; text-align: center; border-top: 1px solid #333; padding-top: 20px; color: #666; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Jozi Student Hub.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Keep legacy for backward compatibility if needed, but alias to new structure
export function generateOrderConfirmationEmail(orderId: string, customerData: { name: string, email: string, address: string, city: string }, items: any[], subtotal: number, shipping: number, total: number, paymentMethod: string) {
    return generateReceiptEmail({
        orderId,
        customerName: customerData.name,
        customerEmail: customerData.email,
        date: new Date(),
        items: items.map(i => ({
            name: i.product?.name || "Product", // Handle if product object is nested or not
            quantity: i.quantity,
            price: i.unit_price || i.price,
            image: i.product?.images?.[0] || i.image || "https://jozistudenthub.co.za/images/placeholder.png"
        })),
        subtotal,
        shipping,
        total,
        shippingAddress: { address: customerData.address, city: customerData.city },
        paymentMethod,
        isAdmin: false
    });
}

export function generateAbandonedCartEmail(customerName: string, items: any[], couponCode: string) {
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                <img src="${item.product.image || item.product.image_urls?.[0] || 'https://jozistudenthub.co.za/images/placeholder.png'}" alt="${item.product.name || item.product.title}" width="64" height="64" style="border-radius: 4px; object-fit: cover; background: #333;" />
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #333; color: #fff; font-family: 'Courier New', Courier, monospace;">
                ${item.product.name || item.product.title}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #333; color: #fff; text-align: right; font-family: 'Courier New', Courier, monospace;">
                ${formatCurrency(item.product.price)}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
            body { background-color: #0f1115; color: #ffffff; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0f1115; padding: 20px; text-align: center; }
            a { color: #8b5cf6; text-decoration: none; }
            h1 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 10px; color: #ffffff; letter-spacing: 1px; }
            p { margin-bottom: 20px; line-height: 1.6; color: #e5e7eb; }
            .coupon-box { margin: 30px auto; padding: 20px; border: 2px dashed #8b5cf6; background: rgba(139, 92, 246, 0.1); border-radius: 8px; display: inline-block; }
            .coupon-code { font-size: 24px; font-weight: bold; color: #8b5cf6; letter-spacing: 2px; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000 !important; font-weight: bold; text-decoration: none; border-radius: 4px; font-family: 'Courier New', Courier, monospace; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="margin-bottom: 30px;">
                <img src="https://jozistudenthub.co.za/images/logo.png" alt="Jozi Student Hub" width="200" style="display: inline-block; max-width: 100%; height: auto;" />
            </div>

            <h1>Hey ${customerName}, you left something behind!</h1>
            <p>We noticed you added some great items to your cart but didn't complete your order. These items are selling fast, so we saved them for you.</p>

            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; text-align: left;">
                ${itemsHtml}
            </table>

            <p style="margin-top: 30px;">To help you complete your purchase, here's a special <strong>10% OFF</strong> discount code just for you. Valid for the next 24 hours!</p>

            <div class="coupon-box">
                <div style="font-size: 14px; text-transform: uppercase; margin-bottom: 5px; color: #e5e7eb;">Use code at checkout:</div>
                <div class="coupon-code">${couponCode}</div>
            </div>

            <div>
                <a href="https://jozistudenthub.co.za/checkout" class="btn">RETURN TO CART</a>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; color: #666; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Jozi Student Hub.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

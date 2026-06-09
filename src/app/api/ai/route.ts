import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export const runtime = "edge";

// --- Types ---
type Action = {
    label: string;
    url?: string;
    query?: string;
};

type AIResponse = {
    response: string;
    products?: any[];
    actions?: Action[];
    status?: "online" | "offline" | "error";
};

// --- Configuration ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitMap = new Map<string, { count: number; expires: number }>();

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.expires) {
        rateLimitMap.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    record.count++;
    return true;
}

async function getStoreContext() {
    try {
        const [dbProducts, dbCategories] = await Promise.all([
            convex.query(api.products.getProducts),
            convex.query(api.products.getCategories)
        ]);

        const categories = dbCategories.map((c: any) => c.name).join(', ');
        
        const saleList = dbProducts.filter((p: any) => p.status === 'published' && p.salePrice).slice(0, 5);
        const saleProducts = saleList.map((p: any) => `${p.title} (R${p.salePrice})`).join(', ');

        const popularList = dbProducts.filter((p: any) => p.status === 'published').slice(0, 5);
        const popularProducts = popularList.map((p: any) => p.title).join(', ');

        return { categories, saleProducts, popularProducts };
    } catch (e) {
        console.error("Failed to fetch store context from Convex:", e);
        return { categories: "", saleProducts: "", popularProducts: "" };
    }
}

// --- System Prompt ---
const SYSTEM_PROMPT = (context: any) => `
You are "Sean", the vibey, helpful shop assistant for Jozi Student Hub (JSH) or SCENTED white-label storefront template.
Your goal is to help students/customers find products, answer questions about delivery/payments, and be a cool companion.

PERSONALITY:
- Tone: South African student slang (Awe, Sharp, Eish, Heita, Sho), friendly, enthusiastic.
- Emoji: Use them frequently but naturally. 🤙🔥📦
- Format: Short, punchy paragraphs. No walls of text.

STORE DATA:
- Categories: ${context.categories}
- On Sale: ${context.saleProducts}
- Popular: ${context.popularProducts}
- Delivery: Free > R500. Priority for UJ/Wits/Auckland Park.
- Payment: Yoco (Card), PayFast (EFT/Card).
- Returns: 7 days, unused.

RULES:
1. RESPONSE FORMAT: You must reply in JSON format ONLY.
   Structure: { "response": "string", "actions": [{ "label": "string", "url": "string" | "query": "string" }] }
2. ACTIONS: Suggest 1-3 relevant actions (buttons) if helpful.
   - Link to pages: "/shop", "/shop?category=tech", "/contact", "/legal/delivery"
   - Suggest queries: "query": "Tell me about speakers" (This triggers a new chat from user)
3. PRODUCTS: If user asks for specific items, mention them.

EXAMPLE JSON:
{
  "response": "Awe! We got the freshest kicks. Check these out! 🔥",
  "actions": [
    { "label": "👟 View Sneakers", "url": "/shop?category=fashion" },
    { "label": "📦 Delivery Info", "query": "How does delivery work?" }
  ]
}
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, checkOnly } = body;

        // 1. Health Check
        if (checkOnly) {
            if (!process.env.GEMINI_API_KEY) {
                return NextResponse.json({ status: "error" }, { status: 503 });
            }
            return NextResponse.json({ status: "online" });
        }

        // 2. Validate Key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                response: "Eish, my brain is invalid. (Missing API Key)",
                status: "error"
            }, { status: 503 });
        }

        // 3. Rate Limit
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        if (!checkRateLimit(ip)) {
            return NextResponse.json({
                response: "Whoa, slow down chief! Too many messages. 😅",
                status: "error"
            }, { status: 429 });
        }

        // 4. Context & Search via Convex
        let productMatches: any[] = [];

        // Simple search if message is long enough
        if (message.length > 2) {
            try {
                const dbProducts = await convex.query(api.products.getProducts);
                const queryWords = message.toLowerCase().split(' ');
                
                productMatches = dbProducts
                    .filter((p: any) => {
                        if (p.status !== 'published') return false;
                        const titleLower = p.title.toLowerCase();
                        const descLower = (p.description || '').toLowerCase();
                        return queryWords.some((word: string) => titleLower.includes(word) || descLower.includes(word));
                    })
                    .slice(0, 4)
                    .map((p: any) => ({
                        id: p._id.toString(),
                        title: p.title,
                        price: p.price,
                        sale_price: p.salePrice || null,
                        slug: p.slug,
                        image_urls: p.imageUrls || []
                    }));
            } catch (e) {
                console.error("Failed to search products in Convex:", e);
            }
        }

        const storeContext = await getStoreContext();

        // 5. Gemini Call
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

        const history = [
            { role: "user", parts: [{ text: SYSTEM_PROMPT(storeContext) }] },
            { role: "model", parts: [{ text: JSON.stringify({ response: "Sho! I'm ready. Awe.", actions: [] }) }] }
        ];

        // Inject found products into the prompt
        let productContext = "";
        if (productMatches.length > 0) {
            productContext = `\n[SYSTEM: Found these matching products in database. excessive details omitted]\n${JSON.stringify(productMatches.map(p => ({ title: p.title, price: p.sale_price || p.price, slug: p.slug })))}`;
        }

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(`User: "${message}"${productContext}`);
        const responseText = result.response.text();

        // 6. Parse & Return
        let parsed: AIResponse;
        try {
            parsed = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON Parse Error", responseText);
            parsed = { response: responseText, actions: [] }; // Fallback if model fails JSON
        }

        // Attach actual product objects if we found matches
        if (productMatches.length > 0) {
            parsed.products = productMatches;
        }

        return NextResponse.json(parsed);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({
            response: "Eish, something broke on my side. Try again just now! 🤕",
            status: "error"
        }, { status: 500 });
    }
}

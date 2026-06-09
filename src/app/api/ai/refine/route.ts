import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an expert E-commerce Copywriter for "Jozi Student Hub" (JSH).
Target Audience: University Students in Johannesburg (UJ, Wits).
Tone: Trendy, persuasive, punchy, "Vibe-checked" but professional.
Goal: Refine the product title, description, and features to increase sales.

Instructions:
1. Title: Make it clear but catchy (SEO friendly).
2. Description: Focus on benefits (Why do they need this for their dorm/room?). Use South African context if applicable.
3. Features: Ensure they are bullet points, distinct and technical details are correct.
4. Output specific JSON format.
`;

export async function POST(req: Request) {
    try {
        const { title, description, features } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Mock response if no key
            return NextResponse.json({
                success: true,
                data: {
                    title: title + " (Refined)",
                    description: description + "\n\n(AI needs GEMINI_API_KEY to really refine this!)",
                    features: features
                }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

        const prompt = `
        Refine this product content:
        Title: "${title}"
        Description: "${description}"
        Features: "${features}"

        Return JSON: { "title": "...", "description": "...", "features": "..." }
        `;

        const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
        const text = result.response.text();
        const json = JSON.parse(text);

        return NextResponse.json({ success: true, data: json });

    } catch (error) {
        console.error("AI Refine Error:", error);
        return NextResponse.json({ success: false, error: "Failed to refine content." }, { status: 500 });
    }
}

require('dotenv').config({ path: '.env.development.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function check() {
    try {
        console.log("Testing Gemini API Key:", process.env.GEMINI_API_KEY.slice(0, 5) + "...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Sending test message...");
        const result = await model.generateContent("Say hello!");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Gemini SDK Crash:", e.message);
    }
}
check();

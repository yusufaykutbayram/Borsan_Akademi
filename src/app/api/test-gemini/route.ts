import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ status: "Error", message: "API Key is missing in Vercel environment variables." });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, verify connection.");
        const response = await result.response;
        return NextResponse.json({ 
            status: "Success", 
            message: "Connection verified!", 
            response: response.text().substring(0, 50) + "..."
        });
    } catch (error: any) {
        return NextResponse.json({ 
            status: "Error", 
            message: error.message || error.toString(),
            suggestion: "Please check if 'Generative Language API' is enabled in Google Cloud Console."
        }, { status: 500 });
    }
}

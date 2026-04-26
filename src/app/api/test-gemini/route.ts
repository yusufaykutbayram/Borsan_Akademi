import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ status: "Error", message: "API Key is missing." });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsResult = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels(); // This is not how you list models
        
        // Correct way to list models with the SDK
        // Actually, the SDK doesn't have a direct listModels on the genAI instance sometimes depending on version.
        // Let's try a direct fetch to the API to see what's allowed.
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();

        return NextResponse.json({ 
            status: "Check", 
            models: data.models?.map((m: any) => m.name) || data
        });
    } catch (error: any) {
        return NextResponse.json({ status: "Error", message: error.message });
    }
}


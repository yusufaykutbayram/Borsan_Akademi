import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ status: "Error", message: "API Key is missing." });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello, verify connection with 2.5-flash.");
        const response = await result.response;
        return NextResponse.json({ 
            status: "Success", 
            message: "Connection verified with Gemini 2.5 Flash!", 
            response: response.text()
        });
    } catch (error: any) {
        return NextResponse.json({ 
            status: "Error", 
            message: error.message || error.toString()
        }, { status: 500 });
    }
}

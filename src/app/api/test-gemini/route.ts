import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ status: "Error", message: "API Key is missing." });
    }

    try {
        // Direct fetch to list all models available for this API key
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ 
                status: "Error", 
                message: data.error.message,
                code: data.error.code,
                status_code: data.error.status
            });
        }

        return NextResponse.json({ 
            status: "Success", 
            available_models: data.models?.map((m: any) => m.name) || "No models list found",
            raw_data: data
        });
    } catch (error: any) {
        return NextResponse.json({ status: "Error", message: error.message });
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Bilgi dosyalarını oku
const getKnowledgeBase = () => {
    try {
        const philosophyPath = path.join(process.cwd(), 'public', 'data', 'industrial_enlightenment_philosophy.md');
        const sunumPath = path.join(process.cwd(), 'public', 'data', 'BORSAN_AKADEMI_SUNUM.html');
        
        console.log("Checking paths:", { philosophyPath, sunumPath });
        
        const philosophy = fs.existsSync(philosophyPath) ? fs.readFileSync(philosophyPath, 'utf8') : '';
        const sunum = fs.existsSync(sunumPath) ? fs.readFileSync(sunumPath, 'utf8') : '';
        
        if (!philosophy && !sunum) {
            console.warn("Knowledge base files not found or empty.");
        }
        
        return `
KNOWLEDGE BASE (BORSAN AKADEMİ ÖZEL BİLGİLERİ):
---
TASARIM VE KURUMSAL FELSEFE:
${philosophy}

KURUMSAL SUNUM VE SİSTEM ÖZETİ:
${sunum}
---
`;
    } catch (error) {
        console.error("Knowledge base reading error:", error);
        return "";
    }
};

// Dynamic prompt is now generated inside the POST handler

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;
        
        console.log("Chat Request received");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return NextResponse.json({ error: "API anahtarı eksik." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const knowledgeBase = getKnowledgeBase();
        
        const systemPrompt = `Sen "Borsan Akademi Dijital Rehberi"sin. 
        Görevin: Çalışan sorularına kısa, sade ve yalın bir dille cevap vermektir. 
        
        ÖNEMLİ KURALLAR:
        1. CEVAPLARI KISA TUT: Uzun paragraflardan kaçın. Bilgiyi en öz ve doğrudan haliyle ver.
        2. SADE DİL: Karmaşık terimler yerine herkesin anlayabileceği yalın bir Türkçe kullan.
        3. MADDELER KULLAN: Eğer birden fazla bilgi vereceksen madde işaretleri (•) kullan.
        4. ODAKLI OL: Sadece sorulan soruya cevap ver, gereksiz genel bilgilerden kaçın.
        
        Bilgi Tabanı:
        ${knowledgeBase}`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // Match the successful test route
        });

        // Use generateContent instead of startChat for maximum compatibility if needed, 
        // but let's try keeping startChat with the prompt in the first message if systemInstruction failed.
        const chat = model.startChat({
            history: history && history.length > 0 ? history : [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Anlaşıldı. Borsan Akademi Dijital Rehberi olarak personelin sorularına en kısa, en sade ve en yalın şekilde cevap vereceğim. Nasıl yardımcı olabilirim?" }]
                }
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Yapay zekadan boş cevap döndü.");
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        
        // Daha detaylı hata mesajı döndür
        let errorMessage = "Mesaj gönderilirken bir hata oluştu.";
        if (error.message?.includes("API key")) {
            errorMessage = "API anahtarı geçersiz veya yetkisiz.";
        } else if (error.message?.includes("quota")) {
            errorMessage = "API kullanım kotası dolmuş olabilir.";
        }

        return NextResponse.json({ 
            error: errorMessage,
            detail: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

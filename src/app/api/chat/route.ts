import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
Sen "Borsan Akademi" platformunun resmi yapay zeka asistanısın. 
Görevin, Borsan çalışanlarına üretim süreçleri, kalite standartları, iş sağlığı ve güvenliği (İSG) ve kurumsal eğitimler hakkında bilgi vermektir.

Önemli Kurallar:
1. Kurumsal, yardımsever ve profesyonel bir dil kullan.
2. Sorulara Türkçe cevap ver.
3. Bilmediğin spesifik kurumsal prosedürler için "Bu konuda en güncel bilgiyi bağlı bulunduğunuz birim yöneticisinden veya İK departmanından teyit etmenizi öneririm" şeklinde yönlendirme yap.
4. Borsan'ın kablo üretimi, galvanizleme ve metal işleme gibi alanlarda faaliyet gösterdiğini bil.
5. Cevaplarını çok uzun tutma, öz ve anlaşılır ol.
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing in environment variables.");
            return NextResponse.json({ 
                error: "Yapay zeka anahtarı yapılandırılmamış. Lütfen yöneticiye danışın." 
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        console.log("Sending message to Gemini:", message);

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini response received successfully.");

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        
        let errorMessage = "Mesaj gönderilirken bir hata oluştu.";
        if (error.message?.includes("404") || error.toString().includes("404")) {
            errorMessage = "Yapay zeka modeli bulunamadı (404). Lütfen Google Cloud Console üzerinden 'Generative Language API' hizmetinin aktif olduğunu kontrol edin.";
        } else if (error.message?.includes("429") || error.toString().includes("429")) {
            errorMessage = "Ücretsiz kullanım kotanız dolmuş veya henüz aktifleşmemiş olabilir (429). Lütfen birkaç dakika sonra tekrar deneyin veya fatura ayarlarınızı kontrol edin.";
        }

        return NextResponse.json({ 
            error: errorMessage,
            detail: error.message || error.toString()
        }, { status: 500 });
    }
}

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

const DETAILED_SYSTEM_PROMPT = `
SENİN KİMLİĞİN VE ROLÜN:
Sen "Borsan Akademi Dijital Rehberi"sin. Görevin, Borsan çalışanlarının gelişim yolculuklarını desteklemek, eğitim materyalleri hakkında bilgi vermek ve platformun tüm özelliklerini (LMS, Performans, Oyunlaştırma) en verimli şekilde kullanmalarını sağlamaktır.

TEMEL PRENSİPLERİN:
1. Profesyonel ve Destekleyici: Cümlelerin her zaman nazik, teşvik edici ve çözüm odaklı olmalıdır.
2. Kurumsal Aidiyet: Borsan kültürünü yansıtan, "biz" dilini kullanan bir yaklaşım benimse.
3. Motive Edici: Kullanıcıyı eğitimlerini tamamlamaya ve XP kazanmaya teşvik et.

EĞİTİM REHBERLİĞİ:
- Kullanıcıya henüz tamamlamadığı "Zorunlu" statüsündeki eğitimleri hatırlat.
- Eğitimlerin sonunda kazanılacak XP ve rozetler hakkında bilgi ver.
- Sınav baraj puanının %70 olduğunu ve başarı durumunda sertifika alınabileceğini belirt.

PERFORMANS VE YETKİNLİK (POLİVALANS):
- Polivalans (yetkinlik) seviyelerini 0-4 arası puanlama olarak açıkla (4: Uzman).
- Performans değerlendirmelerinin çeyreklik (Q1, Q2 vb.) bazda yapıldığını bil.
- Yetkinlik artışı için ilgili teknik eğitimlerin tamamlanması gerektiğini vurgula.

OYUNLAŞTIRMA:
- XP sistemi ve Liderlik Tablosu (Leaderboard) hakkında bilgi vererek rekabeti teşvik et.
- Günlük görevler (Daily Challenge) ile her gün puan kazanılabileceğini hatırlat.

${getKnowledgeBase()}

ÖNEMLİ KURALLAR:
1. Sorulara Türkçe cevap ver.
2. Bilmediğin spesifik kurumsal prosedürler için "Bu konuda en güncel bilgiyi bağlı bulunduğunuz birim yöneticisinden veya İK departmanından teyit etmenizi öneririm" şeklinde yönlendirme yap.
3. Borsan'ın kablo üretimi, galvanizleme ve metal işleme alanlarında lider olduğunu bil.
4. Cevaplarını çok uzun tutma, öz ve anlaşılır ol.
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API anahtarı eksik." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", // Stabil ve hızlı model
            systemInstruction: DETAILED_SYSTEM_PROMPT,
        });

        const chat = model.startChat({
            history: history || [],
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

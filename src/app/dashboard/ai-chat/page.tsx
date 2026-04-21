'use client'
import { useState, useRef, useEffect } from 'react'

export default function AIChatPage() {
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Merhaba, ben Borsan Akademi Yapay Zeka Asistanı. Kurumsal kalite standartları, üretim süreçleri veya atanmış eğitimleriniz hakkında size nasıl yardımcı olabilirim?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        // Simulate AI thinking and network delay
        setTimeout(() => {
            let aiResponse = "Şu anda teknik bir sorun yaşıyorum veya henüz sistemime detaylı eğitim dokümanları yüklenmedi. Ancak yöneticinizden destek alabilirsiniz.";
            
            const lowerMsg = userMsg.toLowerCase();
            if (lowerMsg.includes('galvaniz') || lowerMsg.includes('dross')) {
                aiResponse = "Galvaniz banyosunda dross (cüruf) oluşumuna başlıca iki faktör neden olur: 1. Banyodaki demir çözünmesi (özellikle üretim sırasındaki tel kaynaklı). 2. Banyo sıcaklığındaki dalgalanmalar. Dross oranını azaltmak için banyo sıcaklığının stabil tutulması ve telin temizliğinin (asit banyosu kalitesinin) artırılması önerilir.";
            } else if (lowerMsg.includes('izin') || lowerMsg.includes('tatil')) {
                aiResponse = "İzin hakları ve tatil günleri ile ilgili bilgiler Borsan İnsan Kaynakları prosedürlerinde yer almaktadır. Gerekli formu İK portalından doldurabilirsiniz.";
            } else if (lowerMsg.includes('merhaba') || lowerMsg.includes('selam')) {
                aiResponse = "Merhaba! Size üretim, İSG veya kalite süreçlerimiz hakkında nasıl yardımcı olabilirim?";
            }

            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            setLoading(false);
        }, 1500);
    }

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px', flexShrink: 0 }}>
                <span style={{ fontSize: '48px', display: 'inline-block', marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(225, 30, 38, 0.5))' }}>🤖</span>
                <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', color: 'var(--primary)' }}>Borsan Gelişim Asistanı</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Üretim, kalite veya İSG standartları hakkında soru sorun.</p>
            </div>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ 
                            alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end', 
                            background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'rgba(225, 30, 38, 0.15)', 
                            padding: '16px', 
                            borderRadius: msg.role === 'ai' ? '16px 16px 16px 0' : '16px 16px 0 16px', 
                            maxWidth: '85%', 
                            border: msg.role === 'ai' ? '1px solid var(--glass-border)' : '1px solid rgba(225, 30, 38, 0.3)',
                            color: msg.role === 'ai' ? 'var(--text-main)' : 'white'
                        }}>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{msg.text}</p>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px 16px 16px 0', maxWidth: '85%', border: '1px solid var(--glass-border)' }}>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>🤖 Düşünüyor...</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Örn: Galvaniz banyosunda dross neden oluşur?" 
                        style={{ flex: 1, margin: 0 }} 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }} onClick={handleSend} disabled={loading || !input.trim()}>Gönder</button>
                </div>
            </div>
        </div>
    )
}

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
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for API (excluding the initial system message if needed, 
            // but the API handles the system prompt itself)
            const history = messages.slice(1).map(m => ({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history })
            });

            const data = await response.json();
            
            if (data.error) {
                setMessages(prev => [...prev, { role: 'ai', text: `Hata: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar deneyin.' }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px', flexShrink: 0 }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 0 20px var(--primary-glow)',
                        color: 'white'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8V4H8"></path>
                            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                            <path d="M2 14h2"></path>
                            <path d="M20 14h2"></path>
                            <path d="M15 13v2"></path>
                            <path d="M9 13v2"></path>
                        </svg>
                    </div>
                </div>
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
                            color: msg.role === 'ai' ? 'var(--text-main)' : 'white',
                            boxShadow: msg.role === 'user' ? '0 4px 12px rgba(225, 30, 38, 0.1)' : 'none'
                        }}>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{msg.text}</p>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px 16px 16px 0', maxWidth: '85%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="animate-pulse" style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                                <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>Asistan düşünüyor...</p>
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

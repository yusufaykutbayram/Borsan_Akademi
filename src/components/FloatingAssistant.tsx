'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Merhaba! Ben Borsan Gelişim Asistanı. Size nasıl yardımcı olabilirim?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
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
            setMessages(prev => [...prev, { role: 'ai', text: 'Üzgünüm, şu an bağlantı kuramıyorum.' }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 right-8 z-[60] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden ${isOpen ? 'bg-secondary rotate-90' : 'bg-transparent border-2 border-primary'}`}
                style={{ 
                    boxShadow: isOpen ? '0 8px 16px rgba(0,0,0,0.1)' : '0 8px 16px rgba(227, 6, 19, 0.12)' 
                }}
            >
                {isOpen ? (
                    <span className="text-3xl text-white">✕</span>
                ) : (
                    <div className="relative w-full h-full">
                        <Image 
                            src="/images/mascot.png" 
                            alt="Borsan Mascot" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-44 right-8 z-[60] w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up">
                    <div className="bg-primary p-6 text-white flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center p-1">
                            <div className="relative w-full h-full">
                                <Image 
                                    src="/images/mascot.png" 
                                    alt="Mascot Icon" 
                                    fill 
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Gelişim Asistanı</h3>
                            <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Çevrimiçi • Borsan Akademi</p>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'ai' 
                                    ? 'bg-white text-secondary shadow-sm rounded-tl-none border border-gray-100' 
                                    : 'bg-primary text-white self-end shadow-md rounded-tr-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-white text-secondary p-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2 self-start">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Bir soru sorun..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            🚀
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

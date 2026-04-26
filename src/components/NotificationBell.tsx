'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/announcements')
                const data = await res.json()
                setAnnouncements(data)
            } catch (error) {
                console.error("Fetch announcements error:", error)
            } finally {
                setLoading(false)
            }
        }

        if (isOpen) fetchAnnouncements()
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all relative ${isOpen ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
            >
                <span className="sr-only">Bildirimler</span>
                <span className="text-xl">🔔</span>
                {announcements.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-slide-up">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-secondary text-sm">Duyurular</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{announcements.length} Yeni</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400 text-xs">Yükleniyor...</div>
                        ) : announcements.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-xs">Henüz duyuru bulunmuyor.</div>
                        ) : (
                            announcements.map((item) => (
                                <div key={item.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-default">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === 'NEW_TRAINING' ? 'bg-emerald-500' : 'bg-primary'}`}></div>
                                        <div>
                                            <p className="font-bold text-secondary text-sm leading-tight mb-1">{item.title}</p>
                                            <p className="text-gray-500 text-xs leading-relaxed">{item.content}</p>
                                            <p className="text-[10px] text-gray-300 mt-2 font-medium">
                                                {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 bg-gray-50 text-center">
                        <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Tümünü Okundu İşaretle</button>
                    </div>
                </div>
            )}
        </div>
    )
}

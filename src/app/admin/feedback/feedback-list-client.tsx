'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FeedbackListClient({ feedbacks }: { feedbacks: any[] }) {
    const [openId, setOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        setLoading(id);
        try {
            const res = await fetch('/api/admin/feedback', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action }),
            });

            if (!res.ok) throw new Error("İşlem başarısız");

            router.refresh();
        } catch (error) {
            alert(error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            {feedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white rounded-3xl">Henüz bildirim bulunmuyor.</div>
            )}
            
            {feedbacks.map(f => (
                <div key={f.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    {/* Header / Summary */}
                    <div 
                        className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50/50"
                        onClick={() => setOpenId(openId === f.id ? null : f.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-12 rounded-full ${f.type === 'SUGGESTION' ? 'bg-primary' : 'bg-red-500'}`} />
                            <div>
                                <h3 className="font-bold text-secondary text-lg">{f.title || 'Başlıksız Bildirim'}</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1">
                                    {f.user.name} ({f.user.sicil_no || 'Sicil Yok'}) • {f.department} • {new Date(f.date).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                                ${f.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                                  f.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                                  'bg-red-100 text-red-600'}`}>
                                {f.status === 'PENDING' ? 'BEKLİYOR' : f.status === 'APPROVED' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
                            </div>
                            <span className="text-gray-300 text-xl font-light">
                                {openId === f.id ? '−' : '+'}
                            </span>
                        </div>
                    </div>

                    {/* Expandable Details */}
                    {openId === f.id && (
                        <div className="p-6 pt-0 bg-gray-50/30 border-t border-gray-50 animate-fade-in">
                            <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Açıklama / Detay</p>
                                <p className="text-secondary whitespace-pre-wrap">{f.description}</p>
                            </div>

                            {f.status === 'PENDING' && (
                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        disabled={loading === f.id}
                                        onClick={() => handleAction(f.id, 'REJECT')}
                                        className="px-6 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                                    >
                                        Reddet
                                    </button>
                                    <button 
                                        disabled={loading === f.id}
                                        onClick={() => handleAction(f.id, 'APPROVE')}
                                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        Onayla & 50 XP Ver
                                    </button>
                                </div>
                            )}
                            
                            {f.status === 'APPROVED' && (
                                <div className="flex justify-end mt-4">
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl">Çalışana {f.xp_awarded} XP Puanı Verildi</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

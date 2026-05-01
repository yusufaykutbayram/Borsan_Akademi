'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FeedbackForm() {
    const [type, setType] = useState<'SUGGESTION' | 'NEAR_MISS'>('SUGGESTION');
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Client-side word count check
        const words = description.trim().split(/\s+/);
        if (words.length < 10) {
            setError('Lütfen en az 10 kelime kullanarak detaylıca anlatınız.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, department, description }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Bir hata oluştu.');
            }

            setSuccess(true);
            setDescription('');
            setDepartment('');
            router.refresh(); // Refresh page to see new XP
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-gray-100 space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-secondary">Öneri & Ramak Kala Formu</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setType('SUGGESTION')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${type === 'SUGGESTION' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface text-gray-400'}`}
                    >
                        Öneri Formu
                    </button>
                    <button
                        onClick={() => setType('NEAR_MISS')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${type === 'NEAR_MISS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-surface text-gray-400'}`}
                    >
                        Ramak Kala
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">İlgili Departman</label>
                        <input
                            required
                            placeholder="Örn: Üretim, Bakım, Kalite..."
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kazanılacak Puan</label>
                        <div className="w-full px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10 text-primary font-bold">
                            +50 XP
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        {type === 'SUGGESTION' ? 'Öneriniz' : 'Ramak Kala Olayı'} (En az 10 kelime)
                    </label>
                    <textarea
                        required
                        rows={4}
                        placeholder={type === 'SUGGESTION' ? "Süreci nasıl iyileştirebiliriz?" : "Neler yaşandı? Nasıl önlenebilir?"}
                        className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-xs font-bold">
                        Form başarıyla gönderildi ve +50 XP kazandınız!
                    </div>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                    {loading ? 'GÖNDERİLİYOR...' : 'FORMU GÖNDER'}
                </button>
            </form>
        </section>
    );
}

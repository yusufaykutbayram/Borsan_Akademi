'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function FeedbackForm() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'SUGGESTION' | 'NEAR_MISS'>('SUGGESTION');
    const [title, setTitle] = useState('');
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

        if (!title.trim()) {
            setError('Lütfen bir başlık giriniz.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, title, department, description }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Bir hata oluştu.');
            }

            setSuccess(true);
            setDescription('');
            setDepartment('');
            setTitle('');
            
            // Close modal after 2 seconds
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                router.refresh(); 
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                    <span className="text-lg">💡</span> Öneri / Ramak Kala Bildir
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] p-10 border-none shadow-2xl">
                <DialogHeader>
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-2xl font-bold text-secondary">
                            Bildirim Formu
                        </DialogTitle>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('SUGGESTION')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${type === 'SUGGESTION' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface text-gray-400'}`}
                            >
                                Öneri
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('NEAR_MISS')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${type === 'NEAR_MISS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-surface text-gray-400'}`}
                            >
                                Ramak Kala
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Başlık</label>
                        <input
                            required
                            placeholder="Bildiriminizi özetleyen kısa bir başlık"
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

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
                                +50 XP <span className="text-xs font-normal text-gray-400">(Yönetici Onayından Sonra)</span>
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
                            Form başarıyla gönderildi! Yöneticiniz onayladığında XP puanınız hesabınıza eklenecektir.
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
            </DialogContent>
        </Dialog>
    );
}

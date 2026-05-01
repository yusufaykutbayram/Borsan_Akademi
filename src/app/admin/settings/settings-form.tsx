'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!res.ok) throw new Error("Ayarlar kaydedilemedi.");

            setMessage('Ayarlar başarıyla kaydedildi.');
            router.refresh();
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-gray-100 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-secondary mb-4">SMTP E-posta Ayarları</h3>
                <p className="text-sm text-gray-400 mb-6">Öneri ve Ramak Kala formlarının yöneticilere e-posta ile iletilmesi için bu ayarları eksiksiz doldurmalısınız.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">SMTP Sunucusu (Host)</label>
                        <input
                            placeholder="Örn: smtp.gmail.com"
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={settings['SMTP_HOST'] || ''}
                            onChange={(e) => handleChange('SMTP_HOST', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">SMTP Port</label>
                        <input
                            placeholder="Örn: 587 veya 465"
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={settings['SMTP_PORT'] || ''}
                            onChange={(e) => handleChange('SMTP_PORT', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kullanıcı Adı (E-posta)</label>
                        <input
                            placeholder="Örn: gonderen@sirket.com"
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={settings['SMTP_USER'] || ''}
                            onChange={(e) => handleChange('SMTP_USER', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Şifre / App Password</label>
                        <input
                            type="password"
                            placeholder="E-posta şifresi veya uygulama şifresi"
                            className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                            value={settings['SMTP_PASS'] || ''}
                            onChange={(e) => handleChange('SMTP_PASS', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <hr className="border-gray-50" />

            <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Bildirim Ayarları</h3>
                <div className="space-y-2 max-w-md">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bildirim Alacak Yönetici E-postası</label>
                    <input
                        placeholder="Örn: yonetici@sirket.com"
                        className="w-full px-6 py-4 bg-surface rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/30 transition-all text-secondary"
                        value={settings['ADMIN_EMAIL'] || ''}
                        onChange={(e) => handleChange('ADMIN_EMAIL', e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1 ml-2">Form doldurulduğunda kime e-posta gitsin?</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${message.includes('başarı') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                    {message}
                </div>
            )}

            <button
                disabled={loading}
                type="submit"
                className="px-10 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
            >
                {loading ? 'KAYDEDİLİYOR...' : 'AYARLARI KAYDET'}
            </button>
        </form>
    );
}

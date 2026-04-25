'use client'
import { useState } from 'react'
import { updateTraining } from '../update-action'
import { useRouter } from 'next/navigation'

export function EditTrainingForm({ training }: { training: any }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState(training.type)
    const router = useRouter()

    // Extract content if it's REVEAL
    let initialContent = ''
    if (training.type === 'REVEAL' && training.file_url) {
        try {
            const slides = JSON.parse(training.file_url)
            initialContent = slides.map((s: any) => s.content).join('\n---\n')
        } catch (e) {
            initialContent = training.file_url
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await updateTraining(training.id, formData)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Eğitim başarıyla güncellendi.")
            setTimeout(() => router.push('/admin/trainings'), 1500)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-soft border border-gray-100 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Eğitim Başlığı</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" name="title" defaultValue={training.title} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Materyal Türü</label>
                    <select 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                        name="type" 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="VIDEO">Video (MP4/YouTube)</option>
                        <option value="PDF">Döküman (PDF)</option>
                        <option value="PTX">Sunum (PTX/PPTX)</option>
                        <option value="REVEAL">İnteraktif Slayt (Reveal.js)</option>
                    </select>
                </div>
            </div>

            {type !== 'REVEAL' ? (
                <div className="space-y-2 mb-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Dosya/Medya URL&apos;si</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" name="file_url" defaultValue={training.file_url} required />
                </div>
            ) : (
                <div className="space-y-2 mb-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slayt İçerikleri (--- ile ayırın)</label>
                    <textarea 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium min-h-[300px]" 
                        name="content" 
                        defaultValue={initialContent}
                        required
                    ></textarea>
                </div>
            )}

            <div className="space-y-2 mb-8">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kısa Açıklama</label>
                <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" name="description" defaultValue={training.description} rows={3}></textarea>
            </div>

            <div className="flex gap-4">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-50" disabled={loading}>
                    {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                </button>
                <button type="button" onClick={() => router.push('/admin/trainings')} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-10 py-4 rounded-xl font-bold text-sm transition-all">
                    İptal
                </button>
            </div>

            {msg && <p className={`mt-6 text-sm font-bold ${msg.includes('hata') ? 'text-red-500' : 'text-emerald-500'}`}>{msg}</p>}
        </form>
    )
}

'use client'
import { useState } from 'react'
import { addTraining } from './actions'

export function AddTrainingForm() {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('VIDEO')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await addTraining(formData)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Eğitim başarıyla eklendi ve personele atandı.")
            e.currentTarget.reset()
            setType('VIDEO')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-soft border border-gray-100" style={{ marginBottom: '32px' }}>
            <h3 className="text-xl font-black text-secondary mb-6">Yeni Eğitim Yayını</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="title">Eğitim Başlığı</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" id="title" name="title" required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="type">Materyal Türü</label>
                    <select 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                        id="type" 
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
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="file_url">Dosya/Medya URL&apos;si</label>
                    <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" id="file_url" name="file_url" placeholder="https://..." required />
                </div>
            ) : (
                <div className="space-y-2 mb-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="content">Slayt İçerikleri (Her slayt arasına --- koyun)</label>
                    <textarea 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium min-h-[200px]" 
                        id="content" 
                        name="content" 
                        placeholder="<h1>Slayt 1</h1> --- <h2>Slayt 2</h2>"
                        required
                    ></textarea>
                </div>
            )}

            <div className="space-y-2 mb-8">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="description">Kısa Açıklama</label>
                <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" id="description" name="description" rows={3}></textarea>
            </div>

            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-50" disabled={loading}>
                {loading ? 'Yayınlanıyor...' : 'Eğitimi Yayınla'}
            </button>

            {msg && <p className={`mt-6 text-sm font-bold ${msg.includes('hata') ? 'text-red-500' : 'text-emerald-500'}`}>{msg}</p>}
        </form>
    )
}

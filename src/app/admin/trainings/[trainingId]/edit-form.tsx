'use client'
import { useState, useEffect } from 'react'
import { updateTraining } from '../update-action'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RevealViewer = dynamic(() => import('@/components/RevealViewer'), { ssr: false })

export function EditTrainingForm({ training }: { training: any }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState(training.type)
    const [fileUrl, setFileUrl] = useState(training.file_url || '')
    const [content, setContent] = useState('')
    const router = useRouter()

    // Initialize content if it's REVEAL
    useEffect(() => {
        if (training.type === 'REVEAL' && training.file_url) {
            try {
                const slides = JSON.parse(training.file_url)
                setContent(slides.map((s: any) => s.content).join('\n---\n'))
            } catch (e) {
                setContent(training.file_url)
            }
        }
    }, [training])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await updateTraining(training.id, formData)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("✓ Eğitim başarıyla güncellendi.")
            setTimeout(() => router.push('/admin/trainings'), 1500)
        }
        setLoading(false)
    }

    const slidesPreview = type === 'REVEAL' ? content.split('---').map(s => ({ content: s.trim() })) : []

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-secondary">İçerik Detayları</h3>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Eğitim materyalini buradan güncelleyin</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Eğitim Başlığı</label>
                        <input 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-lg" 
                            name="title" 
                            defaultValue={training.title} 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Materyal Türü</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['VIDEO', 'PTX', 'REVEAL', 'PDF'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all border-2 ${
                                        type === t 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                        : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {t === 'VIDEO' ? '🎬 Video' : t === 'PTX' ? '📊 Sunum' : t === 'REVEAL' ? '✨ İnteraktif' : '📄 PDF'}
                                </button>
                            ))}
                            <input type="hidden" name="type" value={type} />
                        </div>
                    </div>

                    {type !== 'REVEAL' ? (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Dosya / Medya URL&apos;si</label>
                            <input 
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" 
                                name="file_url" 
                                value={fileUrl} 
                                onChange={(e) => setFileUrl(e.target.value)}
                                placeholder="https://..."
                                required 
                            />
                            {type === 'PTX' && (
                                <p className="text-[10px] text-gray-400 font-medium px-1">
                                    💡 OneDrive veya Google Drive paylaşım bağlantısı kullanabilirsiniz.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slayt İçerikleri (--- ile ayırın)</label>
                            <textarea 
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium min-h-[300px] resize-y" 
                                name="content" 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="<h1>Başlık</h1>\n---\n<p>İçerik</p>"
                                required
                            ></textarea>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kısa Açıklama</label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" 
                            name="description" 
                            defaultValue={training.description} 
                            rows={3}
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4 mt-10">
                    <button 
                        type="submit" 
                        className="flex-1 bg-primary hover:bg-primary-dark text-white px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95" 
                        disabled={loading}
                    >
                        {loading ? 'Güncelleniyor...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => router.push('/admin/trainings')} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-5 rounded-2xl font-black text-sm transition-all active:scale-95"
                    >
                        İPTAL
                    </button>
                </div>

                {msg && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-bold animate-slide-up ${msg.includes('hata') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {msg}
                    </div>
                )}
            </form>

            {/* Preview Section */}
            <div className="sticky top-8 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Canlı Önizleme</label>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Görünüm</span>
                </div>
                
                <div className="bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-video relative group border-8 border-gray-800">
                    {type === 'REVEAL' ? (
                        <div className="w-full h-full bg-white scale-[0.5] origin-top-left" style={{ width: '200%', height: '200%' }}>
                            {content ? <RevealViewer slides={slidesPreview} /> : <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-4xl">Slayt İçeriği Bekleniyor...</div>}
                        </div>
                    ) : type === 'VIDEO' ? (
                        fileUrl ? (
                            fileUrl.includes('youtube') || fileUrl.includes('youtu.be') ? (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">YouTube Önizlemesi Devre Dışı</div>
                            ) : (
                                <video key={fileUrl} controls className="w-full h-full object-cover">
                                    <source src={fileUrl} type="video/mp4" />
                                </video>
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">Video URL Bekleniyor...</div>
                        )
                    ) : type === 'PTX' ? (
                        fileUrl ? (
                            <iframe 
                                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
                                className="w-full h-full border-none"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">Sunum URL Bekleniyor...</div>
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold italic">Döküman Önizlemesi Hazırlanıyor...</div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <p className="text-white text-xs font-medium">Bu ekran personelin göreceği arayüzün simülasyonudur.</p>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem]">
                    <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-2">💡 İpucu</h4>
                    <p className="text-secondary/70 text-xs leading-relaxed font-medium">
                        {type === 'REVEAL' 
                            ? 'Her slayt arasına "---" ekleyerek yeni bir sayfa oluşturabilirsiniz. HTML etiketlerini kullanabilirsiniz.' 
                            : 'URL\'nin doğrudan erişilebilir olduğundan emin olun. Personel bu adresteki dosyayı görüntüleyecektir.'}
                    </p>
                </div>
            </div>
        </div>
    )
}


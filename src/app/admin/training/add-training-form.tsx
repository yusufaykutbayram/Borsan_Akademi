'use client'
import { useState } from 'react'
import { addTraining } from './actions'

export function AddTrainingForm() {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await addTraining(formData)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Eğitim başarıyla eklendi ve personele atandı.")
            e.currentTarget.reset()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Yeni Eğitim Ekle</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(150px, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="title">Eğitim Başlığı</label>
                    <input className="input-field" id="title" name="title" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="type">Materyal Türü</label>
                    <select className="input-field" id="type" name="type" style={{ appearance: 'none', cursor: 'pointer' }}>
                        <option value="VIDEO" style={{ color: 'black' }}>Video (MP4/YouTube vb.)</option>
                        <option value="PDF" style={{ color: 'black' }}>Döküman (PDF)</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="file_url">Dosya/Medya URL&apos;si</label>
                <input className="input-field" id="file_url" name="file_url" placeholder="https://..." required />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="description">Kısa Açıklama</label>
                <textarea className="input-field" id="description" name="description" rows={3}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ maxWidth: '200px' }}>
                {loading ? 'Yükleniyor...' : 'Eğitimi Yayınla'}
            </button>

            {msg && <p style={{ marginTop: '16px', fontSize: '14px', color: msg.includes('hata') ? 'var(--danger)' : 'var(--success)' }}>{msg}</p>}
        </form>
    )
}

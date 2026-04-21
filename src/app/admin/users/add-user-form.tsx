'use client'
import { useState } from 'react'
import { addUser } from './actions'

export function AddUserForm() {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await addUser(formData)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Personel başarıyla sisteme eklendi.")
            e.currentTarget.reset()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Yeni Sisteme Personel Ekle</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) auto', gap: '16px', alignItems: 'end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="name">Ad Soyad</label>
                    <input className="input-field" id="name" name="name" placeholder="Ali Veli" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="tc_number">TC No (İlk 6 Hane)</label>
                    <input className="input-field" id="tc_number" name="tc_number" maxLength={6} placeholder="123456" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="role">Hesap Türü</label>
                    <select className="input-field" id="role" name="role" style={{ appearance: 'none', cursor: 'pointer' }}>
                        <option value="EMPLOYEE" style={{ color: 'black' }}>Çalışan</option>
                        <option value="ADMIN" style={{ color: 'black' }}>Yönetici</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
            </div>
            {msg && <p style={{ marginTop: '16px', fontSize: '14px', color: msg.includes('hata') || msg.includes('zaten') ? 'var(--danger)' : 'var(--success)' }}>{msg}</p>}
        </form>
    )
}

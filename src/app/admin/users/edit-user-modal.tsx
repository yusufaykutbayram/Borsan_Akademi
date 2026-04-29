'use client'
import { useState } from 'react'
import { updateUser, deleteUser } from './actions'

interface User {
    id: string
    name: string
    tc_number: string | null
    sicil_no: string | null
    department: string | null
    factory: string | null
    position: string | null
    role: string
    xp_points: number
    start_date: Date | null
    force_pw_change: boolean
}

interface EditUserModalProps {
    user: User
    onClose: () => void
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        
        const data: any = {
            name: formData.get("name"),
            tc_number: formData.get("tc_number"),
            sicil_no: formData.get("sicil_no"),
            department: formData.get("department"),
            factory: formData.get("factory"),
            position: formData.get("position"),
            role: formData.get("role"),
            xp_points: formData.get("xp_points"),
            force_pw_change: formData.get("force_pw_change") === "on",
        }

        const startDate = formData.get("start_date")
        if (startDate) data.start_date = startDate

        const password = formData.get("password")
        if (password) data.password = password

        const res = await updateUser(user.id, data)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Personel başarıyla güncellendi.")
            setTimeout(onClose, 1500)
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return
        
        setLoading(true)
        const res = await deleteUser(user.id)
        if (res?.error) setMsg(res.error)
        else {
            setMsg("Kullanıcı başarıyla silindi.")
            setTimeout(onClose, 1500)
        }
        setLoading(false)
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div 
                className="glass-panel" 
                style={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    maxHeight: '90vh', 
                    overflowY: 'auto',
                    padding: '32px',
                    position: 'relative'
                }} 
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Kullanıcı Düzenle</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Ad Soyad</label>
                            <input className="input-field" name="name" defaultValue={user.name} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">TC No (İlk 6 Hane)</label>
                            <input className="input-field" name="tc_number" defaultValue={user.tc_number || ''} maxLength={6} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sicil No</label>
                            <input className="input-field" name="sicil_no" defaultValue={user.sicil_no || ''} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Rol</label>
                            <select className="input-field" name="role" defaultValue={user.role} style={{ appearance: 'none', cursor: 'pointer' }}>
                                <option value="EMPLOYEE" style={{ color: 'black' }}>Çalışan</option>
                                <option value="ADMIN" style={{ color: 'black' }}>Yönetici</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Departman</label>
                            <input className="input-field" name="department" defaultValue={user.department || ''} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fabrika</label>
                            <input className="input-field" name="factory" defaultValue={user.factory || ''} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pozisyon</label>
                            <input className="input-field" name="position" defaultValue={user.position || ''} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">XP Puanı</label>
                            <input className="input-field" type="number" name="xp_points" defaultValue={user.xp_points} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">İşe Giriş Tarihi</label>
                            <input className="input-field" type="date" name="start_date" defaultValue={user.start_date ? new Date(user.start_date).toISOString().split('T')[0] : ''} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
                            <input className="input-field" type="password" name="password" placeholder="********" />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '30px' }}>
                            <input type="checkbox" id="force_pw_change" name="force_pw_change" defaultChecked={user.force_pw_change} />
                            <label htmlFor="force_pw_change">Şifre Değişikliği Zorunlu</label>
                        </div>
                    </div>

                    {msg && (
                        <div style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            background: msg.includes('hata') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: msg.includes('hata') ? 'var(--danger)' : 'var(--success)',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {msg}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} disabled={loading}>
                            Kullanıcıyı Sil
                        </button>
                        <button type="button" onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }} disabled={loading}>
                            İptal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

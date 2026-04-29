'use client'
import { useState } from 'react'
import { EditUserModal } from './edit-user-modal'

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

interface UserTableClientProps {
    users: User[]
}

export function UserTableClient({ users }: UserTableClientProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    return (
        <>
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Sicil No</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Ad Soyad</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Departman / Fabrika</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Rol</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Pozisyon</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>XP</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 20px', fontWeight: 'bold', color: 'var(--primary)' }}>{u.sicil_no || '-'}</td>
                                <td style={{ padding: '16px 20px' }}>{u.name}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ fontSize: '14px' }}>{u.department || '-'}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{u.factory || '-'}</div>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: u.role === 'ADMIN' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                        color: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--success)'
                                    }}>
                                        {u.role === 'ADMIN' ? 'Yönetici' : 'Çalışan'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '13px' }}>{u.position || '-'}</td>
                                <td style={{ padding: '16px 20px' }}>{u.xp_points} XP</td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => setSelectedUser(u)}
                                        className="btn" 
                                        style={{ 
                                            padding: '6px 12px', 
                                            fontSize: '12px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)'
                                        }}
                                    >
                                        Düzenle
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı kullanıcı bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <EditUserModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </>
    )
}

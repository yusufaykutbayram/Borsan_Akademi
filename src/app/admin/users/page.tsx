import { prisma } from "@/lib/prisma"
import { AddUserForm } from "./add-user-form"

// Dynamically rendering
export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Kullanıcı Yönetimi</h1>
            
            <AddUserForm />

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Ad Soyad</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>TC Kimlik</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Rol</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>XP</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Kayıt Tarihi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 20px' }}>{u.name}</td>
                                <td style={{ padding: '16px 20px' }}>{u.tc_number}</td>
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
                                <td style={{ padding: '16px 20px' }}>{u.xp_points} XP</td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{u.created_at.toLocaleDateString('tr-TR')}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıtlı kullanıcı bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

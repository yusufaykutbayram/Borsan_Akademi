import { prisma } from "@/lib/prisma"
import { AddTrainingForm } from "./add-training-form"

// Dynamically rendering
export const dynamic = 'force-dynamic'

export default async function TrainingPage() {
    const trainings = await prisma.training.findMany({
        orderBy: { created_at: 'desc' },
        include: { exams: true }
    })

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Eğitim İçerikleri & Yönetimi</h1>
            
            <AddTrainingForm />

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Eğitim Adı</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Materyal</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Kayıt Tarihi</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Bağlı Sınav</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainings.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 20px', fontWeight: 500 }}>{t.title}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px',
                                        background: t.type === 'VIDEO' ? 'rgba(37, 99, 235, 0.15)' : t.type === 'PTX' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                        color: t.type === 'VIDEO' ? 'var(--primary)' : t.type === 'PTX' ? '#ec4899' : 'var(--secondary)'
                                    }}>
                                        {t.type}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{t.created_at.toLocaleDateString('tr-TR')}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    {t.exams.length > 0 ? (
                                        <span style={{ color: 'var(--success)' }}>Atanmış</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>Yok</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {trainings.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Sistemde kayıtlı eğitim bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

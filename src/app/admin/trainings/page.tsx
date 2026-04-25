import { prisma } from "@/lib/prisma"
import { AddTrainingForm } from "./add-training-form"
import { deleteTraining } from "./actions"

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
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>İşlem</th>
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
                                    <form action={async () => {
                                        'use server'
                                        await deleteTraining(t.id)
                                    }}>
                                        <button 
                                            type="submit"
                                            className="btn" 
                                            style={{ 
                                                background: 'rgba(239, 68, 68, 0.1)', 
                                                color: 'var(--danger)', 
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                // We can't easily use confirm() in a server action form without a separate client component,
                                                // but for now let's just make it a direct action for simplicity or use a client component.
                                            }}
                                        >
                                            Sil
                                        </button>
                                    </form>
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

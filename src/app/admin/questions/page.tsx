import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
    const questions = await prisma.question.findMany({
        orderBy: { category: 'asc' },
        include: { answers: true }
    })

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Soru Bankası ve Yarışma Yönetimi</h1>
            
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '18px' }}>Mevcut Soru Sayısı: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{questions.length}</span></p>
                <div style={{ marginTop: '24px' }}>
                    <button className="btn btn-primary" style={{ width: 'auto', display: 'inline-block' }}>Excel&apos;den Toplu Soru Yükle</button>
                    <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>* Sadece .xlsx uzantılı şablon dosyaları desteklenir.</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Soru Metni</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Kategori</th>
                            <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>Bağlı Sınav</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(q => (
                            <tr key={q.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 20px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.text}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}>
                                        {q.category}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{q.exam_id ? 'Spesifik Sınav' : 'Genel Havuz (Yarışma)'}</td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Soru bankasında kayıt bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

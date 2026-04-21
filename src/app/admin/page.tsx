import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const userCount = await prisma.user.count({ where: { role: 'EMPLOYEE' } });
    const trainingCount = await prisma.training.count();
    const examCount = await prisma.exam.count();

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Gösterge Paneli</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toplam Çalışan</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0 0', color: 'var(--primary)' }}>{userCount}</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Aktif Eğitimler</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0 0', color: 'var(--secondary)' }}>{trainingCount}</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mevcut Sınavlar</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0 0 0', color: 'var(--success)' }}>{examCount}</p>
                </div>
            </div>

            <div className="glass-panel">
                <h3 style={{ marginBottom: '24px' }}>Sistem Durumu</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Borsan Akademi öğrenim yönetim sistemi aktif. <br/>Sol menüyü kullanarak çalışan/kullanıcı listelerini güncelleyebilir, yeni eğitim dökümanları (PDF/Video) yükleyebilir veya yarışma modülü için soru havuzunu yönetebilirsiniz.</p>
            </div>
        </div>
    )
}

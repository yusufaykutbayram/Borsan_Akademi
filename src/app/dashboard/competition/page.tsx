import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';

export default async function CompetitionDashboard() {
    const session = await auth();

    // Check if user already competed today
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const todaysSession = await prisma.competitionSession.findFirst({
        where: {
            user_id: session!.user.id,
            date: { gte: today }
        }
    });

    return (
        <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{ fontSize: '48px', display: 'inline-block', marginBottom: '16px', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }}>🏆</span>
                <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Borsan Bilgi Yarışması</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Günde 1 kez katıl, yeteneklerini göster ve XP kazan!</p>
            </div>

            <div className="glass-card" style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Kurallar</h3>
                <ul style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '24px' }}>
                    <li>Karşınıza karışık kategorilerden (Üretim, Kalite, İSG) 20 soru çıkacak.</li>
                    <li>Her soru için tam 20 saniyeniz var. Süre biterse otomatik geçilir.</li>
                    <li>Sınavdan çıkarsanız veya sekmeyi kapatırsanız otomatik diskalifiye olursunuz.</li>
                    <li>Doğru cevap sayısı ve hıza bağlı olarak <strong style={{color:'var(--primary)'}}>XP ve Puan</strong> kazanırsınız.</li>
                </ul>

                {todaysSession ? (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Bugünkü yarışma hakkınızı kullandınız.</p>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Turnuva Puanınız: <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>{todaysSession.score}</strong> Puan</p>
                    </div>
                ) : (
                    <Link href="/dashboard/competition/play" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px' }}>
                        Yarışmaya Başla &rarr;
                    </Link>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Günlük Liderlik Tablosu</h3>
            </div>
            
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'linear-gradient(90deg, rgba(230,0,0,0.2), transparent)' }}>
                            <td style={{ padding: '16px', fontSize: '20px', width: '50px', textAlign: 'center' }}>🥇</td>
                            <td style={{ padding: '16px', fontWeight: 'bold' }}>Ahmet Yılmaz</td>
                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--primary)', fontWeight: 'bold' }}>450 Puan</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '16px', fontSize: '20px', width: '50px', textAlign: 'center' }}>🥈</td>
                            <td style={{ padding: '16px', fontWeight: 'bold' }}>Ayşe Kaya</td>
                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-main)', fontWeight: 'bold' }}>420 Puan</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '16px', fontSize: '16px', width: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>4.</td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{session?.user.name} (Siz)</td>
                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>{todaysSession ? todaysSession.score : '-'} Puan</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

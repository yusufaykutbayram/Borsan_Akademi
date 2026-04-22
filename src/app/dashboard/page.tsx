import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        include: { user_badges: { include: { badge: true } } }
    });

    const trainings = await prisma.trainingProgress.findMany({
        where: { user_id: session!.user.id },
        include: { training: true },
        take: 3
    })

    return (
        <div className="animate-fade-in">
            {/* Level Card */}
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(30,33,43,0.8))', border: '1px solid var(--primary-glow)', marginBottom: '24px', boxShadow: '0 8px 32px rgba(37,99,235,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '15px', margin: 0, color: 'var(--text-muted)' }}>Seviye Durumu</h2>
                    <span style={{ background: 'rgba(37,99,235,0.3)', color: '#60a5fa', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(59,130,246,0.3)' }}>Gelişim Uzmanı</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)' }}>{user?.xp_points}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px' }}>XP</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Hedef: 1000 XP</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: `${Math.min((user?.xp_points || 0) / 10, 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #60a5fa)', borderRadius: '8px' }}></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: '24px 16px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '28px' }}>🎯</div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>Görevler</h4>
                </div>
                <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: '24px 16px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.3)', cursor: 'pointer', background: 'linear-gradient(180deg, rgba(245,158,11,0.05), transparent)' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(245,158,11,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '28px', color: 'var(--secondary)' }}>⚡</div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--secondary)' }}>Günün Sınavı</h4>
                </div>
            </div>

            {/* Active Trainings */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Eğitimlerim</h3>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>Tümünü Gör</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {trainings.map(t => (
                    <div key={t.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px', color: 'var(--text-muted)', marginBottom: '8px', display: 'inline-block' }}>{t.training.type === 'VIDEO' ? 'VİDEO' : t.training.type === 'PTX' ? 'SUNUM' : 'DÖKÜMAN'}</span>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', lineHeight: '1.4' }}>{t.training.title}</h4>
                            </div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', borderTopColor: 'var(--primary)' }}>
                                %{t.progress_percentage}
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }}>Eğitime Devam Et</button>
                    </div>
                ))}
                {trainings.length === 0 && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '32px' }}>
                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.5 }}>🎓</span>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Şu an için atanan aktif bir eğitim bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

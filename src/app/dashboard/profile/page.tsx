import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        include: { user_badges: { include: { badge: true } }, certificates: true }
    });

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Profilim</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Kişisel bilgileriniz ve başarılarınız</p>
            
            <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '4px solid rgba(255,255,255,0.1)' }}>
                    👤
                </div>
                <h2 style={{ margin: '0 0 8px 0' }}>{user?.name}</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user?.tc_number} • Borsan Çalışanı</p>
                <div style={{ marginTop: '16px', padding: '8px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', border: '1px solid var(--glass-border)' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '18px' }}>{user?.xp_points} <span style={{fontSize:'12px', color:'var(--text-muted)'}}>XP Puanı</span></span>
                </div>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Kazanılan Rozetler</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {user?.user_badges.map(ub => (
                    <div key={ub.id} style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{ub.badge.icon_id}</div>
                        <p style={{ fontSize: '12px', margin: 0, fontWeight: 'bold' }}>{ub.badge.name}</p>
                    </div>
                ))}
                {(user?.user_badges.length || 0) === 0 && (
                     <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Henüz rozet kazanılmadı.</p>
                     </div>
                )}
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Sertifikalarım</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user?.certificates.map(cert => (
                    <div key={cert.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>Eğitim Sertifikası</p>
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{cert.cert_number}</span>
                        </div>
                        <a href={cert.url} target="_blank" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '12px', width: 'auto' }}>PDF İndir</a>
                    </div>
                ))}
                {(user?.certificates.length || 0) === 0 && (
                     <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px', opacity: 0.5 }}>📜</span>
                        <p style={{ color: 'var(--text-muted)' }}>Henüz sertifika bulunmuyor.</p>
                     </div>
                )}
            </div>
        </div>
    )
}

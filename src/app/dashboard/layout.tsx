import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session || session.user.role === 'ADMIN') redirect("/login");

    return (
        <div style={{ paddingBottom: '90px', minHeight: '100vh', position: 'relative' }}>
            <header className="glass-panel" style={{ borderRadius: '0 0 24px 24px', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {session.user.name?.charAt(0)}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hoş Geldin,</p>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>{session.user.name}</p>
                    </div>
                </div>
                <div>
                     <form action={async () => {
                        "use server";
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '8px 12px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '12px', backdropFilter: 'blur(4px)' }}>Çıkış</button>
                    </form>
                </div>
            </header>
            
            <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {children}
            </main>

            <nav className="glass-panel" style={{ position: 'fixed', bottom: 0, width: '100%', borderRadius: '32px 32px 0 0', padding: '16px 24px', display: 'flex', justifyContent: 'space-around', zIndex: 10, borderBottom: 'none', background: 'rgba(15, 17, 26, 0.85)' }}>
                <Link href="/dashboard" className="nav-item">
                    <span style={{ fontSize: '22px' }}>🏠</span>
                    <span style={{ fontSize: '10px', marginTop: '6px' }}>Ana Sayfa</span>
                </Link>
                <Link href="/dashboard/trainings" className="nav-item">
                    <span style={{ fontSize: '22px' }}>📚</span>
                    <span style={{ fontSize: '10px', marginTop: '6px' }}>Eğitimler</span>
                </Link>
                <Link href="/dashboard/competition" className="nav-item" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-40px', background: 'linear-gradient(135deg, var(--secondary), #ff8f00)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)', border: '4px solid var(--bg-dark)' }}>
                        <span style={{ fontSize: '26px' }}>🏆</span>
                    </div>
                    <span style={{ fontSize: '10px', marginTop: '28px', color: 'var(--secondary)', fontWeight: 'bold' }}>Yarışma</span>
                </Link>
                <Link href="/dashboard/ai-chat" className="nav-item">
                    <span style={{ fontSize: '22px' }}>🤖</span>
                    <span style={{ fontSize: '10px', marginTop: '6px' }}>Asistan</span>
                </Link>
                <Link href="/dashboard/profile" className="nav-item">
                    <span style={{ fontSize: '22px' }}>👤</span>
                    <span style={{ fontSize: '10px', marginTop: '6px' }}>Profil</span>
                </Link>
            </nav>
        </div>
    )
}

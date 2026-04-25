import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') redirect("/login");

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <aside style={{ width: '280px', background: 'var(--bg-card)', borderRight: '1px solid var(--glass-border)', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <Link href="/" style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                    <Image 
                        src="/images/logo.png" 
                        alt="Borsan Logo" 
                        width={180} 
                        height={45} 
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '8px 0 0 0', letterSpacing: '4px', textAlign: 'center', width: '100%' }}>AKADEMİ V1.0</p>
                </Link>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link href="/admin" style={{ padding: '12px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: '600' }}>Gösterge Paneli</Link>
                    <Link href="/admin/users" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Kullanıcı Yönetimi</Link>
                    <Link href="/admin/trainings" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Eğitim İçerikleri</Link>
                    <Link href="/admin/questions" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Soru Bankası</Link>
                    <Link href="/dashboard/ai-chat" style={{ padding: '12px', borderRadius: '8px', color: 'var(--secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                            <path d="M12 8V4H8"></path>
                            <path d="M15 13v2"></path>
                            <path d="M9 13v2"></path>
                        </svg>
                        Yapay Zeka Asistanı
                    </Link>
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <form action={async () => {
                        "use server";
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="btn" style={{ background: '#fef2f2', color: 'var(--danger)', width: '100%', fontSize: '14px' }}>Oturumu Kapat</button>
                    </form>
                </div>
            </aside>
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    )
}

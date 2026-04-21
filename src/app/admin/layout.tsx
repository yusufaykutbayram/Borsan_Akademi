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
                <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ddd, #f5f5f5)', border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                            <span style={{ color: '#E30613', fontWeight: 900, fontSize: '26px', lineHeight: 1 }}>b</span>
                        </div>
                        <span style={{ color: '#E30613', fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }}>borsan</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 0 48px', letterSpacing: '2px' }}>AKADEMİ V1.0</p>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link href="/admin" style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white' }}>Gösterge Paneli</Link>
                    <Link href="/admin/users" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Kullanıcı Yönetimi</Link>
                    <Link href="/admin/training" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Eğitim İçerikleri</Link>
                    <Link href="/admin/questions" style={{ padding: '12px', borderRadius: '8px', color: 'var(--text-muted)' }}>Soru Bankası</Link>
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <form action={async () => {
                        "use server";
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', width: '100%' }}>Oturumu Kapat</button>
                    </form>
                </div>
            </aside>
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    )
}

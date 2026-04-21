import { LoginForm } from './login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <main className="flex-center h-screen animate-fade-in">
      <div className="container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="glass-panel">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              height: '64px',
              background: 'transparent',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #222, #444)', border: '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                        <span style={{ color: '#E30613', fontWeight: 900, fontSize: '34px', lineHeight: 1 }}>b</span>
                    </div>
                    <span style={{ color: '#E30613', fontWeight: 800, fontSize: '42px', letterSpacing: '-1.5px' }}>borsan</span>
                </div>
            </div>
            <h2 style={{ fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--primary)' }}>Akademi</h2>
            <p style={{ color: 'var(--text-muted)' }}>Gelişim ve İnovasyon Platformu</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

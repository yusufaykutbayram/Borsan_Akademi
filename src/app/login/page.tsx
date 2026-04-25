import { LoginForm } from './login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100 space-y-8">
            <div className="text-center space-y-4">
                <Link href="/" className="inline-block transition-transform hover:scale-105">
                    <Image 
                        src="/images/logo.png" 
                        alt="Borsan Logo" 
                        width={240} 
                        height={60} 
                        className="object-contain mx-auto"
                        priority
                    />
                </Link>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-secondary tracking-tight">Akademi</h2>
                    <p className="text-sm text-gray-400 font-medium tracking-wide">Gelişim ve İnovasyon Platformu</p>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <LoginForm />
            </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8 font-medium uppercase tracking-widest">
            © 2026 Borsan Kablo. Tüm hakları saklıdır.
        </p>
      </div>
    </main>
  );
}

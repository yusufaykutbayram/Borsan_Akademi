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
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <Link href="/" className="inline-block">
                <Image 
                    src="/images/logo.png" 
                    alt="Borsan Logo" 
                    width={280} 
                    height={70} 
                    className="object-contain mx-auto"
                    priority
                />
            </Link>
            <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">Akademi Girişi</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">Kurumsal gelişim ve eğitim platformu</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <LoginForm />
        </div>
        
        <p className="text-center text-xs text-gray-400">
            © 2026 Borsan Kablo. Tüm hakları saklıdır.
        </p>
      </div>
    </main>
  );
}

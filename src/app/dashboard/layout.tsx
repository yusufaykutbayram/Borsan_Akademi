import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NavLinks } from "./nav-links";
import FloatingAssistant from "@/components/FloatingAssistant";
import NotificationBell from "@/components/NotificationBell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="min-h-screen bg-surface flex flex-col font-sans">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="transition-opacity hover:opacity-80">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="Borsan Logo" 
                                    width={140} 
                                    height={35} 
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <NavLinks />

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4">
                            <NotificationBell />
                            
                            <div className="flex items-center space-x-3 border-l pl-4 ml-2 border-gray-100">
                                <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                    {session.user.name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-semibold text-gray-900">{session.user.name}</p>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: '/login' });
                                }}>
                                    <button className="text-xs text-gray-400 hover:text-red-600 transition-colors">Çıkış Yap</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>

            {/* Mobile Navigation (Bottom) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-around items-center z-50">
                <Link href="/dashboard" className="text-primary flex flex-col items-center">
                    <span className="text-xl">🏠</span>
                    <span className="text-[9px] font-bold mt-1">Ana Sayfa</span>
                </Link>
                <Link href="/dashboard/trainings" className="text-gray-400 flex flex-col items-center">
                    <span className="text-xl">📚</span>
                    <span className="text-[9px] font-bold mt-1">Eğitimler</span>
                </Link>
                <Link href="/dashboard/quizzes" className="text-gray-400 flex flex-col items-center">
                    <span className="text-xl">🎓</span>
                    <span className="text-[9px] font-bold mt-1">Quizler</span>
                </Link>
                <Link href="/dashboard/competition" className="text-gray-400 flex flex-col items-center">
                    <span className="text-xl">🏆</span>
                    <span className="text-[9px] font-bold mt-1">Yarışma</span>
                </Link>
                <Link href="/dashboard/profile" className="text-gray-400 flex flex-col items-center">
                    <span className="text-xl">👤</span>
                    <span className="text-[9px] font-bold mt-1">Profil</span>
                </Link>
            </nav>

            <FloatingAssistant />
        </div>
    )
}

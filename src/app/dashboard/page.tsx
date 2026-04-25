import Link from "next/link";
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

    const topUsers = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        orderBy: { xp_points: 'desc' },
        take: 5
    })


    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 sm:px-12 sm:py-20 text-white">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Öğren. Yarış.<br />
                        <span className="text-primary">Geliş.</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-lg">
                        Borsan Akademi ile yeteneklerinizi geliştirin, yarışmalara katılın ve kurumsal gelişim yolculuğunda zirveye tırmanın.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/dashboard/trainings" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20">
                            Eğitimlere Başla
                        </Link>
                        <Link href="/dashboard/competition" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold transition-all">
                            Yarışmaya Katıl
                        </Link>
                    </div>
                </div>
                {/* Abstract shapes for "Innovative" feel */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between h-48">
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Mevcut Seviye</span>
                    <div>
                        <p className="text-3xl font-bold text-secondary">Gelişim Uzmanı</p>
                        <p className="text-gray-400 text-sm mt-1">Sonraki seviyeye 240 XP kaldı</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between h-48">
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Toplam Puan</span>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-bold text-secondary">{user?.xp_points}</p>
                        <span className="text-primary font-bold">XP</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between h-48">
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Eğitim İlerlemesi</span>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-3xl font-bold text-secondary">%65</p>
                            <p className="text-gray-400 text-sm">4/6 Tamamlandı</p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                {/* Trainings Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary">Aktif Eğitimler</h2>
                        <Link href="/dashboard/trainings" className="text-primary font-semibold text-sm hover:underline">Tümünü Gör</Link>
                    </div>
                    <div className="space-y-4">
                        {trainings.map(t => (
                            <div key={t.id} className="group bg-white p-6 rounded-2xl shadow-soft border border-gray-50 hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
                                            {t.training.type}
                                        </span>
                                        <h3 className="font-bold text-secondary text-lg group-hover:text-primary transition-colors">{t.training.title}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-xs font-bold text-secondary">
                                        {t.progress_percentage}%
                                    </div>
                                </div>
                                <Link href={`/dashboard/training/${t.training.id}`} className="inline-flex items-center text-sm font-semibold text-secondary group-hover:translate-x-1 transition-transform">
                                    Devam Et <span className="ml-2">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Leaderboard Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary">Liderlik Tablosu</h2>
                        <Link href="/dashboard/competition" className="text-primary font-semibold text-sm hover:underline">Sıralamaya Bak</Link>
                    </div>
                    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                        {topUsers.map((u, index) => (
                            <div key={u.id} className={`flex items-center p-6 ${index !== topUsers.length - 1 ? 'border-b border-gray-50' : ''} ${u.id === session?.user.id ? 'bg-primary/5' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-gray-300 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'text-gray-400'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-secondary">{u.name} {u.id === session?.user.id && '(Sen)'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-secondary font-bold">{u.xp_points}</span>
                                    <span className="text-gray-400 text-[10px] ml-1">XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        include: { user_badges: { include: { badge: true } } }
    });

    const allTrainings = await prisma.training.findMany({
        take: 10,
        orderBy: { created_at: 'desc' }
    });

    const userProgress = await prisma.trainingProgress.findMany({
        where: { user_id: session!.user.id },
        include: { training: true }
    });

    // Merge trainings with progress
    const trainings = allTrainings.map(t => {
        const progress = userProgress.find(p => p.training_id === t.id);
        return {
            ...t,
            progress_percentage: progress?.progress_percentage || 0,
            status: progress?.status || 'NOT_STARTED'
        };
    }).slice(0, 3);

    const totalTrainingsCount = await prisma.training.count();
    const completedTrainingsCount = userProgress.filter(p => p.status === 'COMPLETED').length;
    const overallProgress = totalTrainingsCount > 0 
        ? Math.round((completedTrainingsCount / totalTrainingsCount) * 100) 
        : 0;

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
                        <Link href="/dashboard/quizzes" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold transition-all">
                            Quizler
                        </Link>
                    </div>
                </div>
                {/* Abstract shapes for "Innovative" feel */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
            </section>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Current Level Card */}
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between min-h-[160px] sm:min-h-[200px]">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Mevcut Seviye</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-secondary">{user?.position || "Gelişim Uzmanı"}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">Kurumsal Akademi Üyesi</span>
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Seviye İlerlemesi</span>
                            <span className="text-[10px] font-bold text-primary">240 XP kaldı</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Total Points Card */}
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between min-h-[160px] sm:min-h-[200px]">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Toplam Puan</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-secondary tracking-tighter">{user?.xp_points}</span>
                            <span className="text-primary font-bold text-sm">XP</span>
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <div className="inline-block px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest">Genel Sıralama: <span className="text-primary">#12</span></p>
                        </div>
                    </div>
                </div>

                {/* Mobile Leaderboard (Only visible on mobile) */}
                <div className="md:hidden space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-bold text-secondary">Liderlik Tablosu</h2>
                        <Link href="/dashboard/competition" className="text-primary font-semibold text-xs hover:underline">Yarışmaya Katıl</Link>
                    </div>
                    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                        {topUsers.map((u, index) => (
                            <div key={u.id} className={`flex items-center p-4 ${index !== topUsers.length - 1 ? 'border-b border-gray-50' : ''} ${u.id === session?.user.id ? 'bg-primary/5' : ''}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-gray-300 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'text-gray-400'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-secondary text-sm">{u.name} {u.id === session?.user.id && '(Sen)'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-secondary font-bold text-sm">{u.xp_points}</span>
                                    <span className="text-gray-400 text-[10px] ml-1">XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Training Progress Card (1 column) */}
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between min-h-[160px] sm:min-h-[200px] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Eğitim İlerlemesi</p>
                            <h4 className="font-bold text-secondary">Genel Durum</h4>
                        </div>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                    </div>
                    <div>
                        <div className="flex justify-between items-baseline mb-3">
                            <p className="text-4xl sm:text-5xl font-black text-secondary tracking-tighter">%{overallProgress}</p>
                            <p className="text-gray-400 text-[10px] font-medium uppercase">{completedTrainingsCount}/{totalTrainingsCount} Tamamlandı</p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                        <p className="text-gray-400 text-[10px] mt-4 font-medium italic group-hover:text-primary transition-colors leading-relaxed">
                            {overallProgress === 100 
                                ? "Tebrikler! Tüm eğitimleri başarıyla tamamladın." 
                                : overallProgress > 0 
                                    ? "Harika gidiyorsun! Gelişim yolculuğuna devam et." 
                                    : "Hadi, bugün yeni bir şeyler öğrenmeye ne dersin?"}
                        </p>
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
                                            {t.type}
                                        </span>
                                        <h3 className="font-bold text-secondary text-lg group-hover:text-primary transition-colors">{t.title}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-xs font-bold text-secondary">
                                        {t.progress_percentage}%
                                    </div>
                                </div>
                                <Link href={`/dashboard/training/${t.id}`} className="inline-flex items-center text-sm font-semibold text-secondary group-hover:translate-x-1 transition-transform">
                                    {t.progress_percentage > 0 ? 'Devam Et' : 'Eğitime Başla'} <span className="ml-2">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Leaderboard Section (Hidden on mobile) */}
                <section className="hidden md:block">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary">Liderlik Tablosu</h2>
                        <Link href="/dashboard/competition" className="text-primary font-semibold text-sm hover:underline">Yarışmaya Katıl</Link>
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

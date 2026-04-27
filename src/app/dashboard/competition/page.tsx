import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';

export default async function CompetitionDashboard() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Check if user already competed today
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const todaysSession = await prisma.competitionSession.findFirst({
        where: {
            user_id: session.user.id,
            date: { gte: today }
        }
    });

    // Get Top 10 users globally by XP
    const leaderboard = await prisma.user.findMany({
        orderBy: { xp_points: 'desc' },
        take: 10,
        select: { id: true, name: true, xp_points: true }
    });

    // Find current user's global rank
    const allUsers = await prisma.user.findMany({
        orderBy: { xp_points: 'desc' },
        select: { id: true, xp_points: true }
    });
    const userRank = allUsers.findIndex(u => u.id === session.user.id) + 1;
    const currentUserXp = allUsers.find(u => u.id === session.user.id)?.xp_points || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/5 rounded-3xl mb-4">
                    <span className="text-5xl">🏆</span>
                </div>
                <h1 className="text-4xl font-black text-secondary tracking-tight">Borsan Bilgi Yarışması</h1>
                <p className="text-gray-500 max-w-lg mx-auto">Günde 1 kez katıl, yeteneklerini göster ve XP kazanarak liderlik tablosunda yüksel.</p>
            </div>

            {/* Rules Card */}
            <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 shadow-soft border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-secondary">Yarışma Kuralları</h3>
                        <ul className="space-y-4">
                            {[
                                "Tüm quiz havuzundan 20 rastgele soru.",
                                "Her soru için 20 saniye süre.",
                                "Hızlı cevaplar ek bonus XP kazandırır.",
                                "Günde sadece 1 kez XP kazanılabilir."
                            ].map((rule, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-500 text-sm">
                                    <span className="text-primary font-bold">{i + 1}.</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-3xl border border-gray-50">
                        {todaysSession ? (
                            <div className="text-center space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bugünkü Puanınız</p>
                                <p className="text-5xl font-black text-primary">{todaysSession.score}</p>
                                <p className="text-sm text-gray-500 font-medium mt-2">Güncel Sıran: <span className="text-secondary font-bold">#{userRank}</span></p>
                            </div>
                        ) : (
                            <div className="text-center space-y-6 w-full">
                                <p className="text-sm text-gray-500">Hazır olduğunda başla düğmesine bas.</p>
                                <Link href="/dashboard/competition/play" className="block w-full bg-secondary hover:bg-black text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-black/10">
                                    Yarışmaya Başla
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ranking Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-2xl font-bold text-secondary">Genel Liderlik Tablosu</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Top 10 Oyuncu</p>
                </div>
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface border-b border-gray-100">
                                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sıra</th>
                                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kullanıcı</th>
                                <th className="p-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toplam XP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {leaderboard.map((user, idx) => (
                                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.id === session.user.id ? 'bg-primary/[0.02]' : ''}`}>
                                    <td className={`p-6 font-black text-2xl ${
                                        idx === 0 ? 'text-yellow-500' : 
                                        idx === 1 ? 'text-gray-400' : 
                                        idx === 2 ? 'text-orange-400' : 'text-gray-200'
                                    }`}>
                                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-secondary flex items-center gap-2">
                                            {user.name}
                                            {user.id === session.user.id && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">Siz</span>}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-black text-secondary text-xl">
                                        {user.xp_points.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Current user's rank if not in Top 10 */}
                            {userRank > 10 && (
                                <tr className="bg-primary/5">
                                    <td className="p-6 font-black text-2xl text-primary">
                                        {userRank}
                                    </td>
                                    <td className="p-6 font-bold text-secondary">
                                        {session.user.name} (Siz)
                                    </td>
                                    <td className="p-6 text-right font-black text-primary text-xl">
                                        {currentUserXp.toLocaleString()}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

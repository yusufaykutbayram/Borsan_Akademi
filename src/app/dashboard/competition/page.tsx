import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';

export default async function CompetitionDashboard() {
    const session = await auth();

    // Check if user already competed today
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const todaysSession = await prisma.competitionSession.findFirst({
        where: {
            user_id: session!.user.id,
            date: { gte: today }
        }
    });

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
                                "20 farklı kategoriden seçilmiş sorular.",
                                "Her soru için 20 saniye süre.",
                                "Sekmeden ayrılmak diskalifiye sebebidir.",
                                "Hızlı cevaplar ek bonus XP kazandırır."
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
                                <p className="text-sm text-gray-500 font-medium">Yarın tekrar bekliyoruz!</p>
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
                <h3 className="text-2xl font-bold text-secondary px-2">Günlük Yarışma Sıralaması</h3>
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface border-b border-gray-100">
                                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sıra</th>
                                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kullanıcı</th>
                                <th className="p-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Puan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-6 font-black text-2xl text-yellow-500">01</td>
                                <td className="p-6 font-bold text-secondary">Ahmet Yılmaz</td>
                                <td className="p-6 text-right font-black text-primary text-xl">450</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-6 font-black text-2xl text-gray-400">02</td>
                                <td className="p-6 font-bold text-secondary">Ayşe Kaya</td>
                                <td className="p-6 text-right font-black text-secondary text-xl">420</td>
                            </tr>
                            <tr className="bg-primary/5">
                                <td className="p-6 font-black text-2xl text-primary">04</td>
                                <td className="p-6 font-bold text-secondary">{session?.user.name} (Siz)</td>
                                <td className="p-6 text-right font-black text-primary text-xl">{todaysSession ? todaysSession.score : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function TrainingsPage() {
    const session = await auth()

    const progresses = await prisma.trainingProgress.findMany({
        where: { user_id: session!.user.id },
        include: { training: true },
        orderBy: { updated_at: 'desc' }
    })

    const typeLabel: Record<string, string> = {
        VIDEO: '🎬 Video',
        PDF: '📄 Döküman',
        PTX: '📊 Sunum',
        REVEAL: '✨ İnteraktif Slayt',
        FILE: '📁 Dosya'
    }

    const typeColor: Record<string, string> = {
        VIDEO: 'rgba(37,99,235,0.2)',
        PDF: 'rgba(245,158,11,0.2)',
        PTX: 'rgba(236,72,153,0.2)',
        FILE: 'rgba(16,185,129,0.2)'
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-secondary mb-2">Eğitimlerim</h1>
                <p className="text-gray-500">Size atanan tüm eğitim materyalleri ve gelişim yolculuğunuz.</p>
            </div>

            {progresses.length === 0 && (
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <span className="text-6xl block mb-6 grayscale opacity-20">🎓</span>
                    <p className="text-gray-400 font-medium">Henüz size atanmış bir eğitim bulunmuyor.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progresses.map(p => (
                    <div key={p.id} className="group bg-white rounded-3xl shadow-soft border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all overflow-hidden">
                        <div className="p-8 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-surface text-gray-500 uppercase tracking-widest border border-gray-100">
                                    {p.training.type}
                                </span>
                                {p.progress_percentage >= 100 && (
                                    <span className="text-emerald-500 text-xl">✓</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                                {p.training.title}
                            </h3>
                            {p.training.description && (
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                                    {p.training.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="px-8 pb-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">İlerleme</span>
                                    <span className="text-xs font-bold text-secondary">{p.progress_percentage}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${p.progress_percentage >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                        style={{ width: `${p.progress_percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/training/${p.training.id}`}
                                className={`flex items-center justify-center w-full py-4 rounded-xl font-bold text-sm transition-all border ${
                                    p.progress_percentage >= 100 
                                    ? 'border-gray-100 bg-white text-secondary hover:bg-gray-50' 
                                    : 'bg-primary border-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10'
                                }`}
                            >
                                {p.progress_percentage >= 100 ? 'Tekrar İzle' : p.progress_percentage > 0 ? 'Devam Et' : 'Eğitime Başla'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

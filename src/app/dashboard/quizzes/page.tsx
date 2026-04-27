import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export default async function QuizzesPage() {
    const session = await auth()
    
    // Get specific quiz trainings uploaded via Excel
    const specialQuizzes = await prisma.training.findMany({
        where: { type: 'QUIZ' },
        include: { exams: true },
        orderBy: { created_at: 'desc' }
    })

    const categoryIcons: Record<string, string> = {
        'PRODUCTION': '⚙️', 'QUALITY': '✅', 'ISG': '🛡️',
        'URETIM': '⚙️', 'KALITE': '✅', 'İSG': '🛡️', 'DIĞER': '📚', 'GENEL': '💡'
    }

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-secondary">Quiz Merkezi</h1>
                <p className="text-gray-500">Bilginizi pekiştirin, sınavları tamamlayın ve XP kazanın.</p>
            </div>

            {/* Section 2: Special Quiz Trainings */}
            {specialQuizzes.length > 0 ? (
                <section className="space-y-6 pt-6">
                    <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">📄</span>
                        Quizler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialQuizzes.map(quiz => (
                            <div key={quiz.id} className="group glass-card hover:border-secondary/30 transition-all p-8 border-l-4 border-l-secondary">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">{quiz.category}</span>
                                    <span className="text-xl">{categoryIcons[quiz.category] || '📝'}</span>
                                </div>
                                <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2 h-14">{quiz.title}</h3>
                                <p className="text-gray-400 text-xs mb-6">{quiz.description}</p>
                                <Link 
                                    href={`/dashboard/quizzes/special/${quiz.id}`}
                                    className="block w-full bg-secondary text-white px-6 py-3 rounded-xl font-semibold transition-all text-center hover:bg-secondary-dark"
                                >
                                    Sınavı Başlat
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <div className="col-span-full py-20 text-center glass-card">
                    <p className="text-gray-500">Henüz yüklenmiş bir quiz bulunamadı. Lütfen Admin panelinden Excel ile soru yükleyin.</p>
                </div>
            )}

            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                <h3 className="text-primary font-bold mb-2">Puanlama ve XP</h3>
                <p className="text-secondary/70 text-sm leading-relaxed">
                    Her doğru cevap size **10 XP** kazandırır. Sınavları başarı ile tamamlamak profilinizdeki yetkinlik seviyesini artırır.
                </p>
            </div>
        </div>
    )
}

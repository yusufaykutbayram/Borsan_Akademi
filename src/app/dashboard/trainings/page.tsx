import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import TrainingCategorySection from "@/components/TrainingCategorySection"

export const dynamic = 'force-dynamic'

export default async function TrainingsPage() {
    const session = await auth()

    const allTrainings = await prisma.training.findMany({
        orderBy: { created_at: 'desc' }
    })

    const userProgress = await prisma.trainingProgress.findMany({
        where: { user_id: session!.user.id }
    })

    // Merge all trainings with user progress
    const trainingsWithProgress = allTrainings.map(t => {
        const p = userProgress.find(up => up.training_id === t.id)
        return {
            training: t,
            progress_percentage: p?.progress_percentage || 0,
            status: p?.status || 'NOT_STARTED'
        }
    })

    const categories = [
        { id: 'VIDEO', label: 'Video Eğitimler', emoji: '🎬' },
        { id: 'KALITE', label: 'Kalite Eğitimleri', emoji: '💎' },
        { id: 'URETIM', label: 'Üretim Eğitimleri', emoji: '⚙️' },
        { id: 'ISG', label: 'İş Sağlığı Güvenliği Eğitimleri', emoji: '🛡️' }
    ]

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-secondary mb-2">Eğitimlerim</h1>
                <p className="text-gray-500">Kategorilere tıklayarak içerikleri görüntüleyebilirsiniz.</p>
            </div>

            {trainingsWithProgress.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <span className="text-6xl block mb-6 grayscale opacity-20">🎓</span>
                    <p className="text-gray-400 font-medium">Henüz sisteme eklenmiş bir eğitim bulunmuyor.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {categories.map(cat => {
                        const catProgresses = trainingsWithProgress.filter(p => p.training.category === cat.id)
                        if (catProgresses.length === 0) return null

                        return (
                            <TrainingCategorySection 
                                key={cat.id} 
                                cat={cat} 
                                catProgresses={catProgresses} 
                            />
                        )
                    })}
                    
                    {/* Uncategorized or 'DIĞER' */}
                    {trainingsWithProgress.filter(p => !categories.find(c => c.id === p.training.category)).length > 0 && (
                         <TrainingCategorySection 
                            cat={{ id: 'OTHER', label: 'Diğer Eğitimler', emoji: '📚' }} 
                            catProgresses={trainingsWithProgress.filter(p => !categories.find(c => c.id === p.training.category))} 
                         />
                    )}
                </div>
            )}
        </div>
    )
}

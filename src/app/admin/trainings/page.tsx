import { prisma } from "@/lib/prisma"
import { AddTrainingForm } from "./add-training-form"
import { DeleteTrainingButton } from "./delete-button"

// Dynamically rendering
export const dynamic = 'force-dynamic'

export default async function TrainingPage() {
    const trainings = await prisma.training.findMany({
        orderBy: { created_at: 'desc' },
        include: { exams: true }
    })

    const typeConfig: Record<string, { label: string, color: string, bg: string }> = {
        VIDEO: { label: 'Video', color: 'var(--primary)', bg: 'rgba(37, 99, 235, 0.15)' },
        PTX: { label: 'Sunum', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
        REVEAL: { label: 'İnteraktif', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
        PDF: { label: 'Döküman', color: 'var(--secondary)', bg: 'rgba(245, 158, 11, 0.15)' },
        FILE: { label: 'Dosya', color: 'var(--text-muted)', bg: 'rgba(0, 0, 0, 0.05)' }
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-secondary mb-8">Eğitim İçerikleri & Yönetimi</h1>
            
            <AddTrainingForm />

            <div className="bg-white rounded-[2rem] shadow-premium border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Eğitim Adı</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Materyal</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Kayıt Tarihi</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {trainings.map(t => {
                            const config = typeConfig[t.type] || typeConfig.FILE;
                            return (
                                <tr key={t.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-secondary">{t.title}</td>
                                    <td className="px-8 py-6">
                                        <span 
                                            className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                                            style={{ backgroundColor: config.bg, color: config.color }}
                                        >
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-gray-400 font-medium">
                                        {t.created_at.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DeleteTrainingButton id={t.id} />
                                    </td>
                                </tr>
                            )
                        })}
                        {trainings.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                                    Sistemde kayıtlı eğitim bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

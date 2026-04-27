import { prisma } from "@/lib/prisma"
import { ExcelImportButton } from "@/components/admin/excel-import-button"
import { QuizListAdmin } from "@/components/admin/quiz-list-admin"

export default async function AdminQuestionsPage() {
    // Fetch all Quiz-type trainings with their exams and questions
    const quizTrainings = await prisma.training.findMany({
        where: { type: 'QUIZ' },
        include: {
            exams: {
                include: {
                    questions: {
                        include: {
                            answers: true
                        }
                    }
                }
            }
        },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="space-y-12 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-secondary">Soru Bankası Yönetimi</h1>
                    <p className="text-gray-500">Excel üzerinden yeni quizler oluşturabilir ve mevcut olanları yönetebilirsiniz.</p>
                </div>
            </div>

            {/* Import Section */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">📤</span>
                    Yeni Quiz Yükle
                </h2>
                <ExcelImportButton />
            </section>

            {/* List Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">📋</span>
                    Yüklü Quiz Grupları
                </h2>
                
                {quizTrainings.length === 0 ? (
                    <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                        <p className="text-gray-400">Henüz bir quiz yüklenmedi. Yukarıdaki alanı kullanarak ilk quizi oluşturun.</p>
                    </div>
                ) : (
                    <QuizListAdmin quizGroups={quizTrainings} />
                )}
            </section>
        </div>
    )
}

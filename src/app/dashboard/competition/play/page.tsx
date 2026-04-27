import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import QuizClient from "./quiz-client";

export const dynamic = 'force-dynamic'

export default async function CompetitionPlayPage() {
    const session = await auth();
    if (!session) redirect("/login");

    // 1. Fetch ALL questions from ALL exams (quizzes)
    // We include answers as well
    const allQuestions = await prisma.question.findMany({
        include: {
            answers: true
        }
    });

    if (allQuestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 glass-card">
                <span className="text-6xl mb-6">🏜️</span>
                <h1 className="text-2xl font-bold text-secondary mb-2">Soru Bulunamadı</h1>
                <p className="text-gray-500">Yarışma başlatabilmek için önce sisteme en az bir quiz yüklemelisiniz.</p>
            </div>
        );
    }

    // 2. Shuffle and pick 20 random unique questions
    // If there are less than 20 questions, take all of them
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 20);

    return (
        <div className="py-8">
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center px-4">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Günlük Yarışma</span>
                    <h1 className="text-2xl font-bold text-secondary">Büyük Mücadele</h1>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-sm font-bold border border-primary/20">
                    {selectedQuestions.length} Soru Aktif
                </div>
            </div>
            
            <QuizClient questions={selectedQuestions} />
        </div>
    );
}

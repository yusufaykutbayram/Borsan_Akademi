import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { QuizPlayerWrapper } from "../../[category]/quiz-player-wrapper";

export default async function SpecialQuizPage({ params }: any) {
    const resolvedParams = await params
    const quizId = resolvedParams?.quizId
    const session = await auth();
    
    if (!session) redirect("/login");

    const training = await prisma.training.findUnique({
        where: { id: quizId, type: 'QUIZ' },
        include: { exams: { include: { questions: { include: { answers: true } } } } }
    })

    if (!training || !training.exams[0]) {
        return notFound()
    }

    const questions = training.exams[0].questions

    return (
        <div className="py-8">
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{training.category} Quizi</span>
                    <h1 className="text-2xl font-bold text-secondary">{training.title}</h1>
                </div>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">{questions.length} Soru</span>
            </div>
            
            <QuizPlayerWrapper 
                questions={questions} 
                category={training.category}
            />
        </div>
    )
}

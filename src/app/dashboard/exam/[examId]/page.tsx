import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { QuizPlayerWrapper } from "../../quizzes/[category]/quiz-player-wrapper";

export default async function ExamPage({ params }: any) {
    const resolvedParams = await params;
    const examId = resolvedParams?.examId;
    const session = await auth();
    
    if (!session) redirect("/login");

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { 
            training: true,
            questions: { include: { answers: true } } 
        }
    });

    if (!exam || exam.questions.length === 0) {
        return notFound();
    }

    return (
        <div className="py-8">
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{exam.training.title} Sınavı</span>
                    <h1 className="text-2xl font-bold text-secondary">{exam.title}</h1>
                </div>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">{exam.questions.length} Soru</span>
            </div>
            
            <QuizPlayerWrapper 
                questions={exam.questions} 
                category={exam.training.category}
                examId={exam.id}
                trainingId={exam.training_id}
            />
        </div>
    );
}

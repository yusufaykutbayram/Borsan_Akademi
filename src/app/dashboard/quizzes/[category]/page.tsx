import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { QuizPlayerWrapper } from "./quiz-player-wrapper";

export default async function QuizCategoryPage({ params }: any) {
    const resolvedParams = await params
    const category = resolvedParams?.category?.toUpperCase()
    const session = await auth();
    
    if (!session) redirect("/login");

    const questions = await prisma.question.findMany({
        where: { 
            category: category,
            exam_id: null 
        },
        include: { answers: true }
    });

    if (questions.length === 0) {
        return notFound();
    }

    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

    const categoryTitle = category === 'PRODUCTION' ? 'Üretim Süreçleri' : 
                          category === 'QUALITY' ? 'Kalite Standartları' : 
                          category === 'ISG' ? 'İş Sağlığı ve Güvenliği' : category;

    return (
        <div className="py-8">
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-secondary">{categoryTitle} Testi</h1>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">10 Soru</span>
            </div>
            
            <QuizPlayerWrapper 
                questions={shuffled} 
                category={category}
            />
        </div>
    )
}

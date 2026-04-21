import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QuizClient } from "./quiz-client";

export default async function QuizPage() {
    const session = await auth();
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Prevent retakes
    const todaysSession = await prisma.competitionSession.findFirst({
        where: { user_id: session!.user.id, date: { gte: today } }
    });

    if (todaysSession) {
        redirect("/dashboard/competition");
    }

    // Since SQLite RANDOM() is not natively supported directly via Prisma typical syntax simply,
    // we fetch and shuffle in memory.
    const questions = await prisma.question.findMany({
        where: { exam_id: null }, // Only general pool
        include: { answers: true }
    });

    // eslint-disable-next-line react-hooks/purity
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 20);

    return (
        <div style={{ padding: '0' }}>
            <QuizClient questions={shuffled} />
        </div>
    )
}

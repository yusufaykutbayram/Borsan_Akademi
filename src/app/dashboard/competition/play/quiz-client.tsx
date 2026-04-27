'use client'
import { submitQuiz } from './actions'
import { QuizPlayer } from '@/components/QuizPlayer'

export default function QuizClient({ questions }: { questions: any[] }) {
    const handleFinish = async (finalScore: number, timeSpent: number) => {
        // We pass the final score to server, it returns rank and top users
        const res = await submitQuiz(finalScore);
        return res; // QuizPlayer will use this to show results
    }

    return (
        <QuizPlayer 
            questions={questions} 
            onFinish={handleFinish} 
            redirectPath="/dashboard/competition"
            mode="competition"
        />
    )
}

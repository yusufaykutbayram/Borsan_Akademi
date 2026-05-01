'use client'

import { QuizPlayer } from "@/components/QuizPlayer"
import { submitQuizResults } from "../actions"

export function QuizPlayerWrapper({ questions, category, examId, trainingId }: { questions: any[], category: string, examId?: string, trainingId?: string }) {
    return (
        <QuizPlayer 
            questions={questions}
            onFinish={async (score, timeSpent) => {
                return await submitQuizResults(score, category, examId, trainingId)
            }}
            redirectPath="/dashboard/quizzes"
            mode="quiz"
        />
    )
}

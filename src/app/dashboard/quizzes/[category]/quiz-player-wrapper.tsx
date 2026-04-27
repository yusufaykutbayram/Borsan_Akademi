'use client'

import { QuizPlayer } from "@/components/QuizPlayer"
import { submitQuizResults } from "../actions"

export function QuizPlayerWrapper({ questions, category }: { questions: any[], category: string }) {
    return (
        <QuizPlayer 
            questions={questions}
            onFinish={async (score, timeSpent) => {
                // timeSpent is tracked but not strictly needed for non-competition quizes
                // but we pass it for compatibility
                return await submitQuizResults(score, category)
            }}
            redirectPath="/dashboard/quizzes"
            mode="quiz"
        />
    )
}

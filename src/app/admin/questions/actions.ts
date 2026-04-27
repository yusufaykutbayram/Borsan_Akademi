'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Delete entire quiz group (Training + Exam + Questions + Answers)
export async function deleteQuizGroup(trainingId: string) {
    try {
        // Find the exam associated with this training
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
            include: { exams: { include: { questions: true } } }
        })

        if (!training) throw new Error("Quiz bulunamadı")

        // 1. Delete Answers
        for (const exam of training.exams) {
            const questionIds = exam.questions.map(q => q.id)
            await prisma.answer.deleteMany({
                where: { question_id: { in: questionIds } }
            })
            // 2. Delete Questions
            await prisma.question.deleteMany({
                where: { exam_id: exam.id }
            })
        }

        // 3. Delete Exams
        await prisma.exam.deleteMany({
            where: { training_id: trainingId }
        })

        // 4. Delete Training
        await prisma.training.delete({
            where: { id: trainingId }
        })

        revalidatePath('/admin/questions')
        revalidatePath('/dashboard/quizzes')
        return { success: true }
    } catch (error: any) {
        console.error("Delete error:", error)
        return { success: false, error: error.message }
    }
}

// Update a single question and its answers
export async function updateQuestion(questionId: string, text: string, answers: { id: string, text: string, is_correct: boolean }[]) {
    try {
        // Update question text
        await prisma.question.update({
            where: { id: questionId },
            data: { text: text }
        })

        // Update each answer
        for (const answer of answers) {
            await prisma.answer.update({
                where: { id: answer.id },
                data: { 
                    text: answer.text,
                    is_correct: answer.is_correct
                }
            })
        }

        revalidatePath('/admin/questions')
        return { success: true }
    } catch (error: any) {
        console.error("Update error:", error)
        return { success: false, error: error.message }
    }
}

'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProgress(trainingId: string, userId: string, percentage: number) {
    // Get current progress to ensure we don't decrease it
    const progress = await prisma.trainingProgress.findUnique({
        where: { user_id_training_id: { user_id: userId, training_id: trainingId } }
    })

    if (progress && progress.progress_percentage >= percentage) return;

    await prisma.trainingProgress.update({
        where: { user_id_training_id: { user_id: userId, training_id: trainingId } },
        data: {
            progress_percentage: Math.min(percentage, 100),
            status: percentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
            updated_at: new Date()
        }
    })

    if (percentage >= 100 && progress?.status !== 'COMPLETED') {
        await prisma.user.update({
            where: { id: userId },
            data: { xp_points: { increment: 50 } }
        })
    }
}

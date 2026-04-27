'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitQuiz(score: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Oturum açılmadı" }

    try {
        // Update user XP
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { xp_points: { increment: score } }
        })

        // Fetch all users to calculate rank
        // Sorted by XP descending
        const allUsers = await prisma.user.findMany({
            orderBy: { xp_points: 'desc' },
            select: { id: true, name: true, xp_points: true }
        })

        const totalUsers = allUsers.length
        const rank = allUsers.findIndex(u => u.id === session.user.id) + 1
        const topUsers = allUsers.slice(0, 10).map(u => ({ ...u, xp: u.xp_points }))

        revalidatePath('/dashboard/competition')
        revalidatePath('/dashboard/profile')

        return { 
            success: true, 
            rank, 
            totalUsers, 
            topUsers 
        }
    } catch (error: any) {
        console.error("Submit quiz error:", error)
        return { error: "Puan kaydedilirken bir hata oluştu" }
    }
}

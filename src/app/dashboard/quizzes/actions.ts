'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function submitQuizResults(score: number, category: string) {
    const session = await auth();
    if (!session) return { error: "Oturum süresi doldu." };

    // Update User XP
    // Note: In a production app, we would verify the score on the server, 
    // but for this MVP we trust the client-side calculated score.
    await prisma.user.update({
        where: { id: session.user.id },
        data: { xp_points: { increment: score } }
    });

    // Check for badges
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { user_badges: true }
    });

    const earnedBadgeIds = user!.user_badges.map(b => b.badge_id);

    const eligibleBadges = await prisma.badge.findMany({
        where: {
            required_xp: { lte: user!.xp_points },
            id: { notIn: earnedBadgeIds }
        }
    });

    if (eligibleBadges.length > 0) {
        await prisma.userBadge.createMany({
            data: eligibleBadges.map(b => ({
                user_id: user!.id,
                badge_id: b.id
            }))
        });
    }

    // Record this as an 'EXAM_RESULT' or similar if we want history, 
    // or just let it be a loose quiz.
    // For now, we just give the XP.

    return { success: true }
}

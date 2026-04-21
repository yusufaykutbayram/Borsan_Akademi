'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function submitQuiz(score: number) {
    const session = await auth();
    if (!session) return { error: "Oturum süresi doldu." };

    const today = new Date();
    today.setHours(0,0,0,0);

    const existing = await prisma.competitionSession.findFirst({
        where: { user_id: session.user.id, date: { gte: today } }
    });

    if (existing) return { error: "Bugünlük yarışma hakkınızı zaten kullandınız." };

    // Create session record
    await prisma.competitionSession.create({
        data: {
            user_id: session.user.id,
            category: "MIXED",
            score: score,
            duration_sec: 400 // Logic based on how fast they finished
        }
    });

    // Update User XP
    await prisma.user.update({
        where: { id: session.user.id },
        data: { xp_points: { increment: score } }
    });

    // Automatic Gamification logic: Unlock badges based on XP
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

    return { success: true }
}

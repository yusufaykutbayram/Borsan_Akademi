'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function submitQuizResults(score: number, category: string, examId?: string, trainingId?: string) {
    const session = await auth();
    if (!session) return { error: "Oturum süresi doldu." };

    // Update User XP
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

    // Process Official Exam Result and Certificate
    if (examId && trainingId) {
        // Calculate pass/fail (assuming threshold is 70 for now, or fetch from exam)
        const isPassed = score >= 70; // Hardcoded 70% per user requirement for now

        await prisma.examResult.create({
            data: {
                user_id: user!.id,
                exam_id: examId,
                score: score,
                is_passed: isPassed
            }
        });

        // If passed, mark training as complete and generate certificate
        if (isPassed) {
            // Update training progress to COMPLETED
            await prisma.trainingProgress.upsert({
                where: { user_id_training_id: { user_id: user!.id, training_id: trainingId } },
                update: { status: 'COMPLETED', progress_percentage: 100 },
                create: { user_id: user!.id, training_id: trainingId, status: 'COMPLETED', progress_percentage: 100 }
            });

            // Check if certificate already exists to avoid duplicates
            const existingCert = await prisma.certificate.findFirst({
                where: { user_id: user!.id, training_id: trainingId }
            });

            if (!existingCert) {
                // Generate a unique, readable certificate number
                const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
                const certNumber = `BRSN-${new Date().getFullYear()}-${randomPart}`;

                await prisma.certificate.create({
                    data: {
                        user_id: user!.id,
                        training_id: trainingId,
                        cert_number: certNumber,
                        url: `/dashboard/certificates/${certNumber}` // Dynamic URL pointing to the visual certificate
                    }
                });
            }
        }
    }

    return { success: true }
}

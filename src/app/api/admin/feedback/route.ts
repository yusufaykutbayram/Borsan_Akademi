import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id, action } = await req.json(); // action: "APPROVE" or "REJECT"

        if (!id || !action) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const feedback = await prisma.feedback.findUnique({ where: { id } });
        
        if (!feedback) {
            return new NextResponse("Feedback not found", { status: 404 });
        }

        if (feedback.status !== "PENDING") {
             return new NextResponse("Feedback already processed", { status: 400 });
        }

        let updatedFeedback;

        if (action === "APPROVE") {
            const xpReward = 50;

            updatedFeedback = await prisma.$transaction(async (tx) => {
                // Update feedback status
                const f = await tx.feedback.update({
                    where: { id },
                    data: {
                        status: "APPROVED",
                        xp_awarded: xpReward
                    }
                });

                // Award XP to user
                await tx.user.update({
                    where: { id: feedback.user_id },
                    data: {
                        xp_points: { increment: xpReward }
                    }
                });

                return f;
            });
        } else if (action === "REJECT") {
            updatedFeedback = await prisma.feedback.update({
                where: { id },
                data: {
                    status: "REJECTED"
                }
            });
        } else {
            return new NextResponse("Invalid action", { status: 400 });
        }

        return NextResponse.json(updatedFeedback);
    } catch (error) {
        console.error("Admin Feedback action error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

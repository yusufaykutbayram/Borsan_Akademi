import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { type, department, description } = await req.json();

        // Validation: At least 10 words
        const words = description.trim().split(/\s+/);
        if (words.length < 10) {
            return NextResponse.json(
                { error: "Açıklama en az 10 kelimeden oluşmalıdır." },
                { status: 400 }
            );
        }

        const xpReward = 50; // Award 50 XP for each submission

        const feedback = await prisma.$transaction(async (tx) => {
            // 1. Create feedback record
            const f = await tx.feedback.create({
                data: {
                    user_id: session.user.id as string,
                    type,
                    department,
                    description,
                    xp_awarded: xpReward
                }
            });

            // 2. Award XP to user
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    xp_points: { increment: xpReward }
                }
            });

            return f;
        });

        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Feedback submission error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

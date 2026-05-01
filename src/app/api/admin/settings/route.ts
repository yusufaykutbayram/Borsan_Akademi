import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const settings = await req.json();

        // Save each setting using upsert
        for (const [key, value] of Object.entries(settings)) {
            if (typeof value === 'string') {
                await prisma.systemSetting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save settings error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

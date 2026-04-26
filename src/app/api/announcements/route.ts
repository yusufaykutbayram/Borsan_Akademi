import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { created_at: 'desc' },
            take: 10
        });
        return NextResponse.json(announcements);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}

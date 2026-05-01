import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // Find Birkan
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: 'Birkan',
                    mode: 'insensitive'
                }
            }
        });

        if (users.length === 0) {
            return NextResponse.json({ error: "Birkan not found" }, { status: 404 });
        }

        const user = users[0];

        // Find a training
        const training = await prisma.training.findFirst();
        if (!training) {
            return NextResponse.json({ error: "No training found" }, { status: 404 });
        }

        // Check if certificate already exists
        const existingCert = await prisma.certificate.findFirst({
            where: { user_id: user.id, training_id: training.id }
        });

        if (existingCert) {
            return NextResponse.json({ success: true, message: "Already exists", cert: existingCert });
        }

        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const certNumber = `BRSN-${new Date().getFullYear()}-${randomPart}`;

        const cert = await prisma.certificate.create({
            data: {
                user_id: user.id,
                training_id: training.id,
                cert_number: certNumber,
                url: `/dashboard/certificates/${certNumber}`
            }
        });

        return NextResponse.json({ success: true, cert });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { type, title, department, description } = await req.json();

        // Validation: At least 10 words
        const words = description.trim().split(/\s+/);
        if (words.length < 10) {
            return NextResponse.json(
                { error: "Açıklama en az 10 kelimeden oluşmalıdır." },
                { status: 400 }
            );
        }

        if (!title || title.trim().length === 0) {
             return NextResponse.json(
                { error: "Lütfen bir başlık giriniz." },
                { status: 400 }
            );
        }

        // 1. Create feedback record (Status defaults to PENDING, XP is 0 until approved)
        const feedback = await prisma.feedback.create({
            data: {
                user_id: session.user.id as string,
                type,
                title,
                department,
                description,
                status: "PENDING",
                xp_awarded: 0
            }
        });

        // 2. Try to send an email to the admin
        try {
            const smtpHost = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_HOST' } });
            const smtpPort = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_PORT' } });
            const smtpUser = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_USER' } });
            const smtpPass = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_PASS' } });
            const adminEmail = await prisma.systemSetting.findUnique({ where: { key: 'ADMIN_EMAIL' } });

            if (smtpHost?.value && smtpUser?.value && smtpPass?.value && adminEmail?.value) {
                const transporter = nodemailer.createTransport({
                    host: smtpHost.value,
                    port: parseInt(smtpPort?.value || '587'),
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: smtpUser.value,
                        pass: smtpPass.value,
                    },
                });

                const mailOptions = {
                    from: `"Borsan Akademi Bildirim" <${smtpUser.value}>`,
                    to: adminEmail.value,
                    subject: `Yeni ${type === 'SUGGESTION' ? 'Öneri' : 'Ramak Kala'} Bildirimi: ${title}`,
                    html: `
                        <h2>Yeni Bildirim Geldi!</h2>
                        <p><strong>Gönderen:</strong> ${session.user.name}</p>
                        <p><strong>Tür:</strong> ${type === 'SUGGESTION' ? 'Öneri' : 'Ramak Kala'}</p>
                        <p><strong>Departman:</strong> ${department}</p>
                        <p><strong>Başlık:</strong> ${title}</p>
                        <hr />
                        <p><strong>Açıklama:</strong></p>
                        <p>${description}</p>
                        <hr />
                        <p>Lütfen yönetici paneline girerek bu bildirimi onaylayın veya reddedin.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log("Admin email sent.");
            } else {
                console.warn("SMTP settings not fully configured. Email not sent.");
            }
        } catch (emailErr) {
            console.error("Failed to send email:", emailErr);
            // We don't fail the submission if email fails
        }

        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Feedback submission error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

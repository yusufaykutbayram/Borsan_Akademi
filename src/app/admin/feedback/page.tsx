import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FeedbackListClient } from "./feedback-list-client";

export default async function AdminFeedbackPage() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const feedbacks = await prisma.feedback.findMany({
        orderBy: { date: 'desc' },
        include: {
            user: { select: { name: true, sicil_no: true } }
        }
    });

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-secondary tracking-tight">Öneri ve Ramak Kala Bildirimleri</h1>
                    <p className="text-gray-400 font-medium mt-2">Çalışanlardan gelen formları buradan okuyup değerlendirebilirsiniz.</p>
                </div>
            </div>

            <FeedbackListClient feedbacks={feedbacks} />
        </div>
    );
}

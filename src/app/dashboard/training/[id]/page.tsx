import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TrainingTracker from "./tracker";

export const dynamic = 'force-dynamic'

export default async function TrainingViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session) redirect("/login")

    const training = await prisma.training.findUnique({ where: { id } })
    if (!training) return notFound()

    let progress = await prisma.trainingProgress.findUnique({
        where: { user_id_training_id: { user_id: session.user.id, training_id: id } }
    })

    if (!progress) {
        progress = await prisma.trainingProgress.create({
            data: {
                user_id: session.user.id,
                training_id: id,
                status: 'IN_PROGRESS',
                progress_percentage: 0
            }
        })
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <Link href="/dashboard/trainings" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                ← Eğitimlere Dön
            </Link>

            <div className="glass-card" style={{ marginBottom: '24px' }}>
                 <span style={{
                    fontSize: '11px', background: 'rgba(255,255,255,0.1)',
                    padding: '3px 10px', borderRadius: '8px', color: 'var(--text-muted)',
                    display: 'inline-block', marginBottom: '10px'
                }}>
                    {training.type === 'VIDEO' ? '🎬 Video' : training.type === 'PTX' ? '📊 Sunum' : '📄 Döküman'}
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>{training.title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>{training.description}</p>
            </div>

            <TrainingTracker 
                trainingId={training.id}
                userId={session.user.id}
                type={training.type}
                initialProgress={progress.progress_percentage}
                fileUrl={training.file_url || ""}
            />
        </div>
    )
}

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditTrainingForm } from "./edit-form"

export const dynamic = 'force-dynamic'

export default async function EditTrainingPage({ params }: any) {
    const resolvedParams = await params
    const id = resolvedParams?.trainingId

    if (!id || id === 'undefined') {
        return notFound()
    }

    const training = await prisma.training.findFirst({
        where: { id: id }
    })


    if (!training) return notFound()

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-secondary mb-8">Eğitimi Düzenle</h1>
            <EditTrainingForm training={training} />
        </div>
    )
}


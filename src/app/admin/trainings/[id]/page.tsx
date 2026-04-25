import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditTrainingForm } from "./edit-form"

export default async function EditTrainingPage({ params }: { params: { id: string } }) {
    const training = await prisma.training.findUnique({
        where: { id: params.id }
    })

    if (!training) notFound()

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-secondary mb-8">Eğitimi Düzenle</h1>
            <EditTrainingForm training={training} />
        </div>
    )
}

'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addTraining(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  let file_url = formData.get("file_url") as string
  const content = formData.get("content") as string

  if (type === 'REVEAL') {
    if (!content) return { error: "Lütfen slayt içeriklerini giriniz." }
    const slides = content.split('---').map(s => ({ content: s.trim() }))
    file_url = JSON.stringify(slides)
  }

  if (!title || !type || (!file_url && type !== 'REVEAL')) {
    return { error: "Lütfen gerekli alanları doldurunuz." }
  }

  try {
    const newTraining = await prisma.training.create({
      data: {
        title,
        description,
        type,
        file_url
      }
    })
    
    // Auto-assign to all employees
    const users = await prisma.user.findMany({ where: { role: 'EMPLOYEE' } })
    if (users.length > 0) {
      await prisma.trainingProgress.createMany({
        data: users.map(u => ({
          user_id: u.id,
          training_id: newTraining.id,
          status: "IN_PROGRESS",
          progress_percentage: 0
        }))
      })
    }
    
    revalidatePath("/admin/training")
    return { success: true }
  } catch (e: unknown) {
    console.error(e)
    return { error: "Eğitim eklenirken sistem hatası oluştu." }
  }
}

export async function deleteTraining(id: string) {
  try {
    await prisma.training.delete({
      where: { id }
    })
    revalidatePath("/admin/training")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Eğitim silinirken bir hata oluştu." }
  }
}


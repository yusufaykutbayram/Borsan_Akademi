'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateTraining(id: string, formData: FormData) {
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
    await prisma.training.update({
      where: { id },
      data: {
        title,
        description,
        type,
        file_url
      }
    })
    
    revalidatePath("/admin/trainings")
    return { success: true }
  } catch (e: unknown) {
    console.error(e)
    return { error: "Eğitim güncellenirken bir hata oluştu." }
  }
}

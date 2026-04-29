'use server'
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string
  const tc_number = formData.get("tc_number") as string
  const role = formData.get("role") as string

  if (!name || !tc_number || tc_number.length !== 6) {
    return { error: "Geçersiz veriler. TC ilk 6 hane olmalıdır." }
  }

  try {
    const password_hash = await bcrypt.hash(tc_number, 10)
    await prisma.user.create({
      data: {
        name,
        tc_number,
        password_hash,
        role: role || "EMPLOYEE",
        force_pw_change: true
      }
    })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (e: unknown) {
    const error = e as { code?: string }
    if (error.code === 'P2002') return { error: "TC Kimlik No zaten sistemde kayıtlı." }
    return { error: "Kayıt sırasında teknik bir hata oluştu." }
  }
}

export async function updateUser(userId: string, data: any) {
  try {
    // If password is being updated, hash it
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10)
      delete data.password
    }

    // Convert start_date if it exists
    if (data.start_date) {
      data.start_date = new Date(data.start_date)
    }

    // Convert xp_points if it exists
    if (data.xp_points !== undefined) {
      data.xp_points = parseInt(data.xp_points)
    }

    await prisma.user.update({
      where: { id: userId },
      data: data
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (e: unknown) {
    console.error("Update error:", e)
    return { error: "Güncelleme sırasında bir hata oluştu." }
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (e: unknown) {
    return { error: "Kullanıcı silinirken bir hata oluştu." }
  }
}

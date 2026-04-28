'use server'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfileImage(avatarUrl: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Yetkisiz işlem" }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { avatar_url: avatarUrl }
        })
        revalidatePath('/dashboard/profile')
        return { success: true }
    } catch (error) {
        console.error("Profile image update error:", error)
        return { error: "Profil fotoğrafı güncellenirken bir hata oluştu." }
    }
}

export async function changePassword(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Yetkisiz işlem" }

    const oldPassword = formData.get('oldPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!oldPassword || !newPassword || !confirmPassword) {
        return { error: "Lütfen tüm alanları doldurun." }
    }

    if (newPassword !== confirmPassword) {
        return { error: "Yeni şifreler eşleşmiyor." }
    }

    if (newPassword.length < 6) {
        return { error: "Yeni şifre en az 6 karakter olmalıdır." }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "Kullanıcı bulunamadı." }

        const isValid = await bcrypt.compare(oldPassword, user.password_hash)
        if (!isValid) {
            return { error: "Mevcut şifreniz yanlış." }
        }

        const password_hash = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                password_hash,
                force_pw_change: false 
            }
        })

        return { success: "Şifreniz başarıyla güncellendi." }
    } catch (error) {
        console.error("Password change error:", error)
        return { error: "Şifre güncellenirken bir hata oluştu." }
    }
}

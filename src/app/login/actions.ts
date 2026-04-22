'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // NextAuth handles the redirect upon successful sign in
    await signIn('credentials', Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Hatalı Ad Soyad veya Şifre.'
        default:
          return 'Bir hata oluştu.'
      }
    }
    throw error
  }
}

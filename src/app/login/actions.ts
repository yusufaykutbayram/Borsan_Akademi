'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const name = formData.get('name');
    const password = formData.get('password');
    
    console.log('Action received - Name:', name, 'Password length:', password?.toString().length);
    
    if (!name || !password) {
      return 'Lütfen tüm alanları doldurun.';
    }

    await signIn('credentials', {
      name: name as string,
      password: password as string,
      redirect: false,
    });
    
    return undefined;
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

'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from './actions'
import { useRouter } from 'next/navigation'

function LoginButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
        aria-disabled={pending} 
        disabled={pending}
    >
      {pending ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}
    </button>
  )
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const router = useRouter()

  useEffect(() => {
    if (errorMessage === undefined && !document.querySelector('.bg-red-50')) {
      // If no error message and we just submitted, it might be successful
      // Since we can't easily tell success from useActionState without a specific state,
      // we rely on the action to redirect or we do it here if we can detect it.
    }
  }, [errorMessage])

  return (
    <form action={async (formData) => {
      const result = await dispatch(formData);
      if (!result) {
        // Success! Redirect to home or dashboard
        window.location.href = '/';
      }
    }} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="name">Ad Soyad veya ID</label>
        <input 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium" 
          id="name" 
          name="name" 
          type="text" 
          required 
          placeholder="Örn: admin veya 555555" 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="password">Şifre</label>
        <input 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="••••••" 
        />
      </div>

      <div className="pt-4">
        <LoginButton />
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 text-center">
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  )
}

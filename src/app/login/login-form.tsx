'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from './actions'

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
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="name">Ad Soyad</label>
        <input 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium" 
          id="name" 
          name="name" 
          type="text" 
          required 
          placeholder="Örn: Ahmet Yılmaz" 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="password">Şifre (TC Kimlik No İlk 6 Hane)</label>
        <input 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono" 
          id="password" 
          name="password" 
          type="password" 
          maxLength={6}
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

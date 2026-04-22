'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from './actions'

function LoginButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" className="btn btn-primary" aria-disabled={pending} disabled={pending}>
      {pending ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}
    </button>
  )
}

export function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return (
    <form action={dispatch}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">Ad Soyad</label>
        <input 
          className="input-field" 
          id="name" 
          name="name" 
          type="text" 
          required 
          placeholder="Örn: Ahmet Yılmaz" 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="password">Şifre (TC Kimlik No İlk 6 Hane)</label>
        <input 
          className="input-field" 
          id="password" 
          name="password" 
          type="password" 
          maxLength={6}
          required 
          placeholder="••••••" 
        />
      </div>

      <div style={{ margin: '32px 0 16px 0' }}>
        <LoginButton />
      </div>

      {errorMessage && (
        <div style={{ color: 'var(--danger)', fontSize: '14px', textAlign: 'center', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  )
}

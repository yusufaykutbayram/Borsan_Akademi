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
        <label className="form-label" htmlFor="tc_number">TC Kimlik No (İlk 6 Hane)</label>
        <input 
          className="input-field" 
          id="tc_number" 
          name="tc_number" 
          type="text" 
          maxLength={6} 
          required 
          placeholder="Örn: 123456" 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="password">Şifre</label>
        <input 
          className="input-field" 
          id="password" 
          name="password" 
          type="password" 
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

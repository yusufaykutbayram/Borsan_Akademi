'use client'
import { useState } from 'react'
import { changePassword } from './actions'

export function PasswordChangeForm() {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState({ type: '', text: '' })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMsg({ type: '', text: '' })

        const formData = new FormData(e.currentTarget)
        const res = await changePassword(formData)

        if (res.error) {
            setMsg({ type: 'error', text: res.error })
        } else if (res.success) {
            setMsg({ type: 'success', text: res.success })
            e.currentTarget.reset()
        }
        setLoading(false)
    }

    return (
        <section className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-soft border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                    🔑
                </div>
                <div>
                    <h3 className="text-xl font-black text-secondary">Şifre Değiştir</h3>
                    <p className="text-xs text-gray-400 font-medium">Hesap güvenliğiniz için düzenli aralıklarla şifrenizi güncelleyin.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="oldPassword">Mevcut Şifre</label>
                    <input 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm" 
                        id="oldPassword" 
                        name="oldPassword" 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="newPassword">Yeni Şifre</label>
                    <input 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm" 
                        id="newPassword" 
                        name="newPassword" 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
                    <input 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        required 
                    />
                </div>
                
                <div className="md:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    {msg.text && (
                        <p className={`text-sm font-bold ${msg.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {msg.text}
                        </p>
                    )}
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-secondary/20 disabled:opacity-50" 
                        disabled={loading}
                    >
                        {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                    </button>
                </div>
            </form>
        </section>
    )
}

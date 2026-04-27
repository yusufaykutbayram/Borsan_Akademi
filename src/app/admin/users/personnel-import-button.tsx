'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PersonnelImportButton() {
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!confirm('Çalışan listesini yüklemek istediğinize emin misiniz? Mevcut bilgiler güncellenecek, yeniler eklenecektir.')) {
            e.target.value = ''
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/admin/users/import', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (data.success) {
                alert(data.message)
                router.refresh()
            } else {
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('İşlem sırasında bir hata oluştu.')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div style={{ marginBottom: '24px' }}>
            <label className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20">
                {uploading ? (
                    'Yükleniyor...'
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Excel ile Çalışan Yükle
                    </>
                )}
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange} 
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </label>
        </div>
    )
}

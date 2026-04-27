'use client'

import React, { useState, useRef } from 'react'

export function ExcelImportButton() {
    const [isUploading, setIsUploading] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('DIĞER')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!title.trim()) {
            setMessage({ type: 'error', text: 'Lütfen bir başlık girin.' })
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setIsUploading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('category', category)

            const response = await fetch('/api/admin/questions/import', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                setMessage({ type: 'success', text: result.message })
                setTitle('')
                setTimeout(() => window.location.reload(), 2000)
            } else {
                throw new Error(result.error || "Sunucu hatası")
            }

        } catch (error: any) {
            console.error("Upload error:", error)
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="glass-panel" style={{ 
            padding: '32px', 
            maxWidth: '500px', 
            margin: '0 auto', 
            textAlign: 'left',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: '24px',
            border: '1px solid #e5e7eb'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Soru Grubu / Quiz Başlığı
                </label>
                <input 
                    type="text" 
                    placeholder="Örn: Kılıf Hattı Operatörlük Sınavı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ 
                        width: '100%', 
                        background: '#f9fafb', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '12px', 
                        padding: '14px', 
                        color: '#111827',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
            </div>

            <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Kategori
                </label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ 
                        width: '100%', 
                        background: '#f9fafb', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '12px', 
                        padding: '14px', 
                        color: '#111827',
                        fontSize: '15px',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="URETIM" style={{ color: '#111827' }}>ÜRETİM</option>
                    <option value="KALITE" style={{ color: '#111827' }}>KALİTE</option>
                    <option value="ISG" style={{ color: '#111827' }}>İSG</option>
                    <option value="DIĞER" style={{ color: '#111827' }}>DİĞER</option>
                </select>
            </div>

            <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                ref={fileInputRef}
                disabled={isUploading}
            />
            
            <button 
                className={`btn ${isUploading ? 'btn-disabled' : 'btn-primary'}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{ 
                    width: '100%', 
                    padding: '16px', 
                    fontSize: '16px', 
                    fontWeight: '700',
                    boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.2)'
                }}
            >
                {isUploading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span className="spinner-small"></span> Yükleniyor...
                    </span>
                ) : 'Excel Yükle ve Quiz Oluştur'}
            </button>

            {message && (
                <div style={{ 
                    marginTop: '20px', 
                    padding: '14px', 
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center',
                    background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#f87171'}`
                }}>
                    {message.text}
                </div>
            )}
        </div>
    )
}

'use client'
import { useState, useRef } from 'react'
import { updateProfileImage } from './actions'
import Image from 'next/image'

interface ProfileImageUploadProps {
    initialImage: string | null
    name: string
}

export function ProfileImageUpload({ initialImage, name }: ProfileImageUploadProps) {
    const [image, setImage] = useState<string | null>(initialImage)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Dosya boyutu çok büyük (Maksimum 2MB)")
            return
        }

        setUploading(true)
        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result as string
            const res = await updateProfileImage(base64String)
            if (res.success) {
                setImage(base64String)
            } else {
                alert(res.error || "Yükleme başarısız")
            }
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="relative group">
            <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform group-hover:scale-105 bg-primary flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {image ? (
                    <Image 
                        src={image} 
                        alt={name} 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">👤</span>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Değiştir</span>
                </div>

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
    )
}

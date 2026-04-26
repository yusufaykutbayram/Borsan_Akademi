'use client'

import { useState, useEffect, useRef } from 'react'
import { updateProgress } from './actions'
import dynamic from 'next/dynamic'

const RevealViewer = dynamic(() => import('@/components/RevealViewer'), { 
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-50 animate-pulse flex items-center justify-center rounded-3xl text-gray-400">Yükleniyor...</div>
})

const PDFSlideViewer = dynamic(() => import('@/components/PDFSlideViewer'), { 
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-50 animate-pulse flex items-center justify-center rounded-3xl text-gray-400 text-sm uppercase tracking-widest font-bold">Döküman Hazırlanıyor...</div>
})

interface TrackerProps {
    trainingId: string
    userId: string
    type: string
    initialProgress: number
    fileUrl: string
}

export default function TrainingTracker({ trainingId, userId, type, initialProgress, fileUrl }: TrackerProps) {
    const [progress, setProgress] = useState(initialProgress)
    const [isCompleted, setIsCompleted] = useState(initialProgress >= 100)
    const [timeLeft, setTimeLeft] = useState(type === 'PTX' || type === 'REVEAL' ? 45 : 0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const lastUpdateRef = useRef<number>(initialProgress)

    // Parse slides if REVEAL type
    let displaySlides = [
        { content: '<h1 style="color: #E30613; font-weight: 900;">Borsan Akademi</h1><p style="color: #666;">İçerik Yükleniyor...</p>' }
    ]

    if (type === 'REVEAL' && fileUrl) {
        try {
            displaySlides = JSON.parse(fileUrl)
        } catch (e) {
            console.error("Reveal JSON parsing error:", e)
        }
    }

    // Handle Video Progress
    const handleVideoTimeUpdate = () => {
        if (!videoRef.current) return
        const current = videoRef.current.currentTime
        const total = videoRef.current.duration
        if (!total) return

        const currentPercentage = Math.floor((current / total) * 100)
        
        if (currentPercentage > lastUpdateRef.current) {
            setProgress(currentPercentage)
            lastUpdateRef.current = currentPercentage
            
            if (currentPercentage % 5 === 0) {
                updateProgress(trainingId, userId, currentPercentage)
            }
        }
    }

    const handleVideoEnded = () => {
        setProgress(100)
        setIsCompleted(true)
        updateProgress(trainingId, userId, 100)
    }

    // Handle Presentation/Reveal Timer
    useEffect(() => {
        if ((type === 'PTX' || type === 'REVEAL') && !isCompleted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [type, isCompleted])

    const handleCompleteManual = async () => {
        setProgress(100)
        setIsCompleted(true)
        await updateProgress(trainingId, userId, 100)
        window.location.reload()
    }

    const isVideo = type === 'VIDEO'
    const isPTX = type === 'PTX'
    const isReveal = type === 'REVEAL'
    const isYoutube = isVideo && (fileUrl?.includes('youtube.com') || fileUrl?.includes('youtu.be'))

    let embedUrl = fileUrl || ''
    if (isYoutube && fileUrl) {
        const videoId = fileUrl.includes('youtu.be')
            ? fileUrl.split('youtu.be/')[1]?.split('?')[0]
            : new URLSearchParams(fileUrl.split('?')[1]).get('v')
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`
    }

    return (
        <div style={{ marginTop: '24px' }}>
            {/* Media Display */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-premium border border-gray-100 flex flex-col items-center justify-center relative min-h-[500px]">
                {isReveal ? (
                    <div className="w-full h-[600px]">
                        <RevealViewer slides={displaySlides} />
                    </div>
                ) : isYoutube ? (
                    <iframe 
                        src={embedUrl}
                        style={{ width: '100%', height: '60vh', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : isVideo ? (
                    <video 
                        ref={videoRef}
                        controls 
                        onTimeUpdate={handleVideoTimeUpdate}
                        onEnded={handleVideoEnded}
                        controlsList="nodownload"
                        style={{ width: '100%', maxHeight: '80vh', display: 'block' }}
                    >
                        <source src={fileUrl || ''} type="video/mp4" />
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                ) : (isPTX || type === 'PDF') ? (
                    <div className="w-full h-[650px]">
                        <PDFSlideViewer fileUrl={fileUrl || ''} />
                    </div>
                ) : (
                    <iframe 
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl || '')}&embedded=true`}
                        style={{ width: '100%', height: '75vh', border: 'none' }}
                        title="Döküman Görüntüleyici"
                    />
                )}

            </div>

            {/* Progress Bar & Controls */}
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 mt-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Eğitim İlerlemesi</span>
                    <span className="text-xl font-black text-secondary">%{progress}</span>
                </div>
                <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>

                {(isPTX || isYoutube || isReveal) && !isCompleted && (
                    <div className="text-center">
                        {timeLeft > 0 ? (
                            <p className="text-gray-400 text-sm font-medium">
                                Lütfen içeriği inceleyin. Bitir butonu <span className="text-primary font-bold">{timeLeft}</span> saniye sonra aktif olacaktır.
                            </p>
                        ) : (
                            <button 
                                onClick={handleCompleteManual}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                            >
                                Eğitimi Tamamladım
                            </button>
                        )}
                    </div>
                )}

                {isVideo && !isYoutube && !isCompleted && (
                    <p className="text-gray-400 text-sm font-medium text-center">
                        Eğitimin tamamlanması için videoyu sonuna kadar izlemelisiniz.
                    </p>
                )}

                {isCompleted && (
                    <div className="text-center text-emerald-500 font-bold flex items-center justify-center gap-2">
                        <span className="text-xl">✓</span> Bu eğitimi başarıyla tamamladınız!
                    </div>
                )}
            </div>
        </div>
    )
}

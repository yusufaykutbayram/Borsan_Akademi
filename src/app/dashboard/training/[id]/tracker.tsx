'use client'

import { useState, useEffect, useRef } from 'react'
import { updateProgress } from './actions'

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
    const [timeLeft, setTimeLeft] = useState(type === 'PTX' ? 45 : 0) // 45 seconds for presentations
    const videoRef = useRef<HTMLVideoElement>(null)
    const lastUpdateRef = useRef<number>(initialProgress)
    const [isFocusMode, setIsFocusMode] = useState(false)

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
            
            // Auto-save every 5%
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

    // Handle Presentation Timer
    useEffect(() => {
        if (type === 'PTX' && !isCompleted) {
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
        window.location.reload() // Refresh to show XP and status
    }

    const isVideo = type === 'VIDEO'
    const isPTX = type === 'PTX'
    const isYoutube = isVideo && (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be'))

    let embedUrl = fileUrl
    if (isYoutube) {
        const videoId = fileUrl.includes('youtu.be')
            ? fileUrl.split('youtu.be/')[1]?.split('?')[0]
            : new URLSearchParams(fileUrl.split('?')[1]).get('v')
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`
    }

    return (
        <div style={{ marginTop: '24px' }}>
            {/* Focus Mode Overlay */}
            {isFocusMode && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    background: 'var(--bg-dark)', 
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--glass-border)' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Odaklanma Modu: {isPTX ? 'Sunum' : 'Video'}</span>
                        <button 
                            onClick={() => setIsFocusMode(false)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Moddan Çık
                        </button>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isYoutube ? (
                            <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                        ) : isVideo ? (
                            <video ref={videoRef} controls onTimeUpdate={handleVideoTimeUpdate} onEnded={handleVideoEnded} style={{ width: '100%', height: '100%', maxHeight: '100vh' }}>
                                <source src={fileUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`} style={{ width: '100%', height: '100%', border: 'none' }} />
                        )}
                    </div>
                </div>
            )}

            {/* Media Display */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button 
                    onClick={() => setIsFocusMode(true)}
                    style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        right: '16px', 
                        zIndex: 5, 
                        background: 'rgba(0,0,0,0.5)', 
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)', 
                        color: 'white', 
                        padding: '8px', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <span>🔲</span> Odaklanma Modu
                </button>

                {isYoutube ? (
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
                        <source src={fileUrl} type="video/mp4" />
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                ) : isPTX ? (
                    <iframe 
                        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
                        style={{ width: '100%', height: '75vh', border: 'none' }}
                        title="Sunum Görüntüleyici"
                    />
                ) : (
                    <iframe 
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                        style={{ width: '100%', height: '75vh', border: 'none' }}
                        title="Döküman Görüntüleyici"
                    />
                )}
            </div>

            {/* Progress Bar & Controls */}
            <div className="glass-card" style={{ marginTop: '24px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Eğitim İlerlemesi</span>
                    <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>%{progress}</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #60a5fa)', transition: 'width 0.3s ease' }}></div>
                </div>

                {(isPTX || isYoutube) && !isCompleted && (
                    <div style={{ textAlign: 'center' }}>
                        {timeLeft > 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                Lütfen {isPTX ? 'sunumu' : 'videoyu'} inceleyin. Bitir butonu {timeLeft} saniye sonra aktif olacaktır.
                            </p>
                        ) : (
                            <button 
                                onClick={handleCompleteManual}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px' }}
                            >
                                Eğitimi Tamamladım
                            </button>
                        )}
                    </div>
                )}

                {isVideo && !isYoutube && !isCompleted && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                        Eğitimin tamamlanması için videoyu sonuna kadar izlemelisiniz.
                    </p>
                )}

                {isCompleted && (
                    <div style={{ textAlign: 'center', color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>✅ Bu eğitimi başarıyla tamamladınız!</span>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker from CDN for easier setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`

interface PDFSlideViewerProps {
    fileUrl: string;
    onPageChange?: (currentPage: number, totalPages: number) => void;
}

export default function PDFSlideViewer({ fileUrl, onPageChange }: PDFSlideViewerProps) {
    const deckDivRef = useRef<HTMLDivElement>(null)
    const [pages, setPages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setLoading(true)
                const loadingTask = pdfjsLib.getDocument(fileUrl)
                const pdf = await loadingTask.promise
                const numPages = pdf.numPages
                const pageImages: string[] = []

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i)
                    const viewport = page.getViewport({ scale: 2 }) // High resolution
                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')
                    canvas.height = viewport.height
                    canvas.width = viewport.width

                    if (context) {
                        await page.render({ canvasContext: context, viewport }).promise
                        pageImages.push(canvas.toDataURL('image/png'))
                    }
                }
                setPages(pageImages)
                setLoading(false)
            } catch (err: any) {
                console.error("PDF loading error:", err)
                setError("PDF dökümanı yüklenemedi. Lütfen dosya yolunu kontrol edin.")
                setLoading(false)
            }
        }

        if (fileUrl) loadPdf()
    }, [fileUrl])

    useEffect(() => {
        const initReveal = async () => {
            if (pages.length > 0 && deckDivRef.current && !isLoaded) {
                const Reveal = (await import('reveal.js')).default
                const deck = new Reveal(deckDivRef.current, {
                    embedded: true,
                    hash: false,
                    margin: 0,
                    center: true,
                    touch: true,
                    progress: true,
                    controls: true,
                    transition: 'slide',
                    backgroundTransition: 'fade'
                })
                await deck.initialize()
                
                deck.on('slidechanged', (event: any) => {
                    if (onPageChange) {
                        onPageChange(event.indexh + 1, pages.length)
                    }
                })

                // Initial progress report
                if (onPageChange) onPageChange(1, pages.length)

                setIsLoaded(true)
            }
        }

        initReveal()
    }, [pages, isLoaded])

    if (loading) {
        return (
            <div className="w-full h-[600px] bg-gray-50 flex flex-col items-center justify-center rounded-3xl gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Eğitim Hazırlanıyor...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-[600px] bg-red-50 flex items-center justify-center rounded-3xl text-red-500 font-bold p-8 text-center">
                {error}
            </div>
        )
    }

    return (
        <div className="w-full h-full min-h-[600px] relative bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-800">
            {/* CSS Imports */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css" />

            <div className="reveal" ref={deckDivRef}>
                <div className="slides">
                    {pages.map((img, index) => (
                        <section key={index} style={{ padding: 0 }}>
                            <img 
                                src={img} 
                                alt={`Sayfa ${index + 1}`} 
                                className="mx-auto" 
                                style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }} 
                            />
                        </section>
                    ))}
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-50 text-[10px] font-bold text-white/30 uppercase tracking-widest pointer-events-none">
                Borsan Akademi Sunum Modu
            </div>
        </div>
    )
}

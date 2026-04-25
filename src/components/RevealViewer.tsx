'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Slide {
    content: string;
}

interface RevealViewerProps {
    slides: Slide[];
}

export default function RevealViewer({ slides }: RevealViewerProps) {
    const deckDivRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const initReveal = async () => {
            // Import CSS dynamically if possible or use global imports in layout
            // For now, let's ensure reveal.js is loaded
            const Reveal = (await import('reveal.js')).default
            if (deckDivRef.current && !isLoaded) {
                const deck = new Reveal(deckDivRef.current, {
                    embedded: true,
                    hash: false,
                    margin: 0.1,
                    center: true,
                    touch: true,
                    progress: true,
                    controls: true,
                    transition: 'slide',
                })
                await deck.initialize()
                setIsLoaded(true)
            }
        }

        initReveal()
    }, [slides, isLoaded])

    return (
        <>
            {/* Standard CSS injection via style tag for maximum compatibility during build */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/white.css" />
            
            <div className="reveal-viewport" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px', background: '#fff', borderRadius: '1.5rem', overflow: 'hidden' }}>
                <div className="reveal" ref={deckDivRef}>
                    <div className="slides">
                        {slides.map((slide, index) => (
                            <section 
                                key={index} 
                                dangerouslySetInnerHTML={{ __html: slide.content }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

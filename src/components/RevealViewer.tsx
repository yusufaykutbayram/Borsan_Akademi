'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'

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
        // Dynamic import for reveal.js to avoid SSR issues
        const initReveal = async () => {
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
    )
}

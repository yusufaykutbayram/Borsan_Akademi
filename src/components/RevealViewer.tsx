'use client'

import React, { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css' // We can change this to a custom Borsan theme later

interface Slide {
    content: string; // HTML content
}

interface RevealViewerProps {
    slides: Slide[];
}

export default function RevealViewer({ slides }: RevealViewerProps) {
    const deckDivRef = useRef<HTMLDivElement>(null)
    const deckRef = useRef<Reveal.Api | null>(null)

    useEffect(() => {
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            embedded: true,
            hash: false,
            margin: 0.1,
            center: true,
            touch: true,
            progress: true,
            controls: true,
            transition: 'slide', // 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom'
        })

        deckRef.current.initialize().then(() => {
            // Reveal is ready
        })

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (e) {
                console.warn("Reveal destruction error:", e);
            }
        }
    }, [])

    return (
        <div className="reveal-viewport" style={{ position: 'relative', width: '100%', height: '600px', background: '#fff', borderRadius: '1.5rem', overflow: 'hidden' }}>
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

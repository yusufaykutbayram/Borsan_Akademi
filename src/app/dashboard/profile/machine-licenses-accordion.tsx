'use client'

import { useState } from 'react'
import { LicenseCard } from '@/components/LicenseCard'

interface MachineLicensesAccordionProps {
    licenses: any[];
    user: any;
}

export function MachineLicensesAccordion({ licenses, user }: MachineLicensesAccordionProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (licenses.length === 0) return null;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 sm:p-10 text-left hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-2xl">
                        🪪
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Makine Çalıştırma Ehliyetlerim</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                            {licenses.length} ADET YETKİ TANIMLANDI
                        </p>
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-secondary text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="px-4 sm:px-10 pb-10 animate-slide-up">
                    <div className="flex overflow-x-auto gap-4 sm:gap-8 pb-6 scrollbar-hide snap-x snap-mandatory px-4">
                        {licenses.map(license => (
                            <div key={license.id} className="snap-center flex-shrink-0 first:pl-4 last:pr-4">
                                <LicenseCard 
                                    license={license} 
                                    user={user} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

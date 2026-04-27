'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MandatoryTrainingsAccordionProps {
    trainings: any[];
}

export function MandatoryTrainingsAccordion({ trainings }: MandatoryTrainingsAccordionProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (trainings.length === 0) return null;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 sm:p-10 text-left hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                        🚨
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Zorunlu Eğitimlerim</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                            {trainings.length} ADET EĞİTİM TANIMLANDI
                        </p>
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="px-8 pb-10 sm:px-10 animate-slide-up">
                    <div className="space-y-3">
                        {trainings.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-all">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="font-bold text-secondary text-sm truncate group-hover:text-primary transition-colors">
                                        {p.training.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${p.status === 'COMPLETED' ? 'text-emerald-500' : 'text-primary'}`}>
                                            {p.status === 'COMPLETED' ? 'Tamamlandı' : `%${p.progress_percentage} Tamamlandı`}
                                        </span>
                                        {p.training.description === 'Eğitim yüklenecektir.' && (
                                            <span className="text-[10px] text-gray-400 italic">Eğitim yüklenecek</span>
                                        )}
                                    </div>
                                </div>
                                <Link 
                                    href={`/dashboard/training/${p.training.id}`}
                                    className="px-5 py-2 bg-white text-secondary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-gray-100 hover:border-primary shadow-sm"
                                >
                                    {p.status === 'COMPLETED' ? 'Tekrar İzle' : 'Devam Et'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

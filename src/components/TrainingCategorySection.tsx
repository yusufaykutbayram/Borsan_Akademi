'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TrainingCategorySectionProps {
    cat: { id: string, label: string, emoji: string };
    catProgresses: any[];
}

export default function TrainingCategorySection({ cat, catProgresses }: TrainingCategorySectionProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <section className="space-y-4">
            {/* Category Header (Clickable) */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all border ${
                    isExpanded 
                    ? 'bg-white border-primary/20 shadow-lg' 
                    : 'bg-white/50 border-gray-100 hover:bg-white hover:border-primary/10'
                }`}
            >
                <div className="flex items-center gap-4">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-secondary uppercase tracking-tight">{cat.label}</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {catProgresses.length} EĞİTİM MATERYALİ
                        </span>
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 animate-slide-up">
                    {catProgresses.map(p => (
                        <div key={p.id} className="group bg-white rounded-3xl shadow-soft border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all overflow-hidden">
                            <div className="p-8 flex-1">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-surface text-gray-500 uppercase tracking-widest border border-gray-100">
                                            {p.training.type === 'REVEAL' ? '✨ İNTERAKTİF' : p.training.type}
                                        </span>
                                        {p.is_mandatory && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-primary text-white uppercase tracking-widest">
                                                ZORUNLU
                                            </span>
                                        )}
                                        {p.progress_percentage >= 100 && (
                                            <span className="text-emerald-500 text-xl ml-auto">✓</span>
                                        )}
                                    </div>
                                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {p.training.title}
                                </h3>
                                {p.training.description && (
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                                        {p.training.description}
                                    </p>
                                )}
                            </div>
                            
                            <div className="px-8 pb-8 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">İlerleme</span>
                                        <span className="text-xs font-bold text-secondary">{p.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${p.progress_percentage >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                            style={{ width: `${p.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <Link
                                    href={`/dashboard/training/${p.training.id}`}
                                    className={`flex items-center justify-center w-full py-4 rounded-xl font-bold text-sm transition-all border ${
                                        p.progress_percentage >= 100 
                                        ? 'border-gray-100 bg-white text-secondary hover:bg-gray-50' 
                                        : 'bg-primary border-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/10'
                                    }`}
                                >
                                    {p.progress_percentage >= 100 ? 'Tekrar İzle' : p.progress_percentage > 0 ? 'Devam Et' : 'Eğitime Başla'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

'use client'
import { useState } from 'react'

export function PerformanceCard({ evaluation }: { evaluation: any }) {
    const [expanded, setExpanded] = useState(false)

    const gradeColors: Record<string, string> = {
        'A': 'bg-emerald-500',
        'B': 'bg-blue-500',
        'C': 'bg-orange-500',
        'D': 'bg-red-500'
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
            <div 
                className="p-6 cursor-pointer flex items-center justify-between group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${gradeColors[evaluation.final_grade] || 'bg-gray-500'} flex items-center justify-center text-white font-black text-2xl shadow-lg transform transition-transform group-hover:scale-105`}>
                        {evaluation.final_grade}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{evaluation.period}</p>
                        <h4 className="font-bold text-secondary text-lg">Performans Değerlendirmesi</h4>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-black text-secondary tracking-tighter">{evaluation.total_score}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toplam Puan</p>
                    </div>
                    <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="px-6 pb-8 pt-2 space-y-6 animate-fade-in">
                    <div className="h-px bg-gray-50 w-full"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        {evaluation.metrics.map((m: any) => (
                            <div key={m.id} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[11px] font-bold text-secondary uppercase tracking-tight opacity-80">{m.title}</span>
                                    <span className="text-xs font-black text-primary">{m.score} <span className="text-gray-300 font-medium">/ {m.max_score}</span></span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${m.score / m.max_score > 0.8 ? 'bg-emerald-500' : m.score / m.max_score > 0.5 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                        style={{ width: `${(m.score / m.max_score) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-surface rounded-2xl p-4 mt-4 border border-gray-50 flex items-center gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            Bu puanlar yöneticiniz tarafından yapılan değerlendirmeler sonucunda oluşmuştur. Detaylar için insan kaynakları ile görüşebilirsiniz.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

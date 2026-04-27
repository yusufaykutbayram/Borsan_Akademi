'use client'

import React from 'react'

interface LicenseCardProps {
    license: {
        line_name: string;
        score: number;
        level: string;
        issued_at: Date | string;
        is_valid: boolean;
    };
    user: {
        name: string;
        sicil_no?: string | null;
        department?: string | null;
        position?: string | null;
    };
}

export function LicenseCard({ license, user }: LicenseCardProps) {
    const issueDate = new Date(license.issued_at).toLocaleDateString('tr-TR');
    
    return (
        <div className="w-[85vw] sm:w-[500px] max-w-lg bg-[#fafafa] rounded-[2rem] shadow-premium overflow-hidden border border-[#eee] font-sans relative flex flex-col group transition-all hover:shadow-2xl h-[300px] sm:h-[320px]">
            {/* Top Branding Strip */}
            <div className="h-2.5 bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#001f3f]"></div>
            
            <div className="p-6 sm:p-10 flex gap-6 sm:gap-10 flex-1">
                {/* Left Column: Photo + Score */}
                <div className="flex flex-col items-center gap-4 sm:gap-6 flex-shrink-0">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-32 h-32 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-[#eee] overflow-hidden shadow-soft flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-500">
                            👤
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 h-8 bg-[#001f3f] rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-[10px] sm:text-xs text-white font-bold">✓</span>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="relative w-12 h-12 sm:w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f0f0f0" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke={license.is_valid ? "#001f3f" : "#ff4d4d"}
                                    strokeWidth="8"
                                    strokeDasharray={Math.PI * 90}
                                    strokeDashoffset={Math.PI * 90 * (1 - license.score / 4)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-base sm:text-2xl font-black text-[#001f3f] leading-none">{license.score}</span>
                                <span className="text-[7px] sm:text-[10px] text-gray-400 font-bold">/ 4</span>
                            </div>
                        </div>
                        <div className="bg-[#001f3f]/5 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full">
                            <p className="font-black text-[#001f3f] text-[8px] sm:text-xs uppercase tracking-[0.2em]">{license.level}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-8">
                        <h2 className="text-[10px] sm:text-[12px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-black uppercase">Makine Çalıştırma Ehliyeti</h2>
                        <div className="h-0.5 sm:h-1 w-10 sm:w-16 bg-[#001f3f] rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-5">
                        <div className="space-y-0.5">
                            <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">PERSONEL ADI SOYADI</p>
                            <p className="text-sm sm:text-lg font-black text-black tracking-tight truncate">{user.name}</p>
                        </div>
                        
                        <div className="flex gap-4 sm:gap-10">
                            <div className="space-y-0.5">
                                <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">SİCİL NO</p>
                                <p className="text-[10px] sm:text-sm font-bold text-[#333]">{user.sicil_no || "---"}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">DÜZENLEME</p>
                                <p className="text-[10px] sm:text-sm font-bold text-[#333]">{issueDate}</p>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">HAT / ÜRETİM ALANI</p>
                            <p className="text-[10px] sm:text-sm font-bold text-[#333] truncate">{license.line_name}</p>
                        </div>

                        <div className="space-y-0.5 hidden sm:block">
                            <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">İŞLETME MÜDÜRLÜĞÜ</p>
                            <p className="text-[10px] sm:text-sm font-bold text-[#333]">Zayıf Akım İşletme Müdürlüğü</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle branding and validity indicator */}
            <div className="px-6 sm:px-10 py-4 sm:py-6 bg-white border-t border-[#f5f5f5] flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-2.5 h-2.5 rounded-full bg-[#001f3f]"></div>
                    <span className="text-[8px] sm:text-[10px] font-black text-[#001f3f] tracking-[0.2em] sm:tracking-[0.3em] uppercase">Borsan Akademi</span>
                </div>
                <div className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full text-[8px] sm:text-[11px] font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase ${license.is_valid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {license.is_valid ? 'GEÇERLİ' : 'GEÇERSİZ'}
                </div>
            </div>

            {!license.is_valid && (
                <div className="absolute inset-0 bg-red-500/[0.04] pointer-events-none backdrop-grayscale-[0.5]"></div>
            )}
        </div>
    )
}

function DetailRow({ icon, label, value }: { icon: string, label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-[10px] font-bold text-[#333]">{value}</p>
        </div>
    )
}

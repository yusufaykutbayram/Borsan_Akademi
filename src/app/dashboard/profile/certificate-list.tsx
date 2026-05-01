'use client';

import { useState } from 'react';
import { CertificateViewer } from './certificate-viewer-modal';

interface CertificateListProps {
    certificates: any[];
}

export function CertificateList({ certificates }: CertificateListProps) {
    const [selectedCert, setSelectedCert] = useState<any>(null);

    return (
        <>
            <div className="space-y-4">
                {certificates.map(cert => (
                    <div key={cert.id} className="bg-white p-6 rounded-3xl shadow-soft border border-gray-50 flex justify-between items-center group transition-all hover:border-primary/20">
                        <div className="min-w-0 flex-1 mr-4">
                            <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors truncate">{cert.training.title}</p>
                            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{cert.cert_number}</span>
                        </div>
                        <button 
                            onClick={() => setSelectedCert(cert)}
                            className="px-4 sm:px-6 py-2 bg-surface hover:bg-primary hover:text-white text-secondary rounded-xl font-bold text-xs transition-all border border-gray-100 hover:border-primary whitespace-nowrap"
                        >
                            Görüntüle / İndir
                        </button>
                    </div>
                ))}
                {certificates.length === 0 && (
                    <div className="py-12 bg-surface rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
                        <span className="text-4xl block opacity-20 grayscale">📜</span>
                        <p className="text-gray-400 text-sm">Henüz sertifika bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedCert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCert(null)}></div>
                    <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-black text-secondary">Sertifika Görüntüle</h3>
                                <p className="text-xs text-gray-400 font-medium">Sertifikanızı inceleyebilir veya PDF olarak indirebilirsiniz.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    id="modal-download-btn"
                                    className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    PDF İndir
                                </button>
                                <button 
                                    onClick={() => setSelectedCert(null)}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-all"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Scrollable for mobile */}
                        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-gray-50 flex items-center justify-center">
                            <div className="w-full">
                                <CertificateViewer 
                                    certNumber={selectedCert.cert_number}
                                    userName={selectedCert.user?.name || "Çalışan"}
                                    trainingName={selectedCert.training.title}
                                    date={new Date(selectedCert.issued_at).toLocaleDateString('tr-TR')}
                                    downloadBtnId="modal-download-btn"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

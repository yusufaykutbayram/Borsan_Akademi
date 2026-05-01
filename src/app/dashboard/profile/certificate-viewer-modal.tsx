'use client';

import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface CertificateViewerProps {
    certNumber: string;
    userName: string;
    trainingName: string;
    date: string;
    downloadBtnId: string;
}

export function CertificateViewer({ certNumber, userName, trainingName, date, downloadBtnId }: CertificateViewerProps) {
    const certRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const btn = document.getElementById(downloadBtnId);
        if (!btn) return;

        const handleDownload = async () => {
            if (!certRef.current) return;
            
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = 'Hazırlanıyor...';
            btn.setAttribute('disabled', 'true');

            try {
                const canvas = await html2canvas(certRef.current, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    // Ensure the capture is the full resolution of the certificate
                    width: 1123, // A4 landscape at 96dpi approx
                    height: 794
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${certNumber}_Sertifika.pdf`);
            } catch (error) {
                console.error("PDF oluşturma hatası:", error);
                alert("PDF oluşturulurken bir hata meydana geldi.");
            } finally {
                btn.innerHTML = originalBtnText;
                btn.removeAttribute('disabled');
            }
        };

        btn.addEventListener('click', handleDownload);
        return () => btn.removeEventListener('click', handleDownload);
    }, [certNumber, downloadBtnId]);

    return (
        /* The container for visual display - responsive */
        <div className="w-full mx-auto overflow-x-auto pb-4 scrollbar-hide">
            {/* The actual certificate - fixed size for export but scaled down for display */}
            <div 
                ref={certRef} 
                className="bg-white shadow-xl relative mx-auto overflow-hidden shrink-0" 
                style={{ 
                    width: '1000px', 
                    height: '707px', // A4 Landscape ratio
                    transform: 'scale(var(--cert-scale, 1))',
                    transformOrigin: 'top center',
                    margin: '0 auto',
                    // Responsive scaling using CSS variable
                }}
            >
                <div className="absolute inset-0 p-12 bg-white flex flex-col items-center justify-between border-[20px] border-[#f8fafc]">
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary opacity-10"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary opacity-10"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary opacity-10"></div>

                    {/* Header */}
                    <div className="text-center mt-4">
                        <div className="flex justify-center mb-6">
                            <Image src="/images/logo.png" alt="Borsan Logo" width={180} height={45} className="object-contain" />
                        </div>
                        <h1 className="text-5xl font-black text-secondary tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Başarı Sertifikası</h1>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {/* Body */}
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <p className="text-xl text-gray-400 italic font-medium">Bu belge,</p>
                        <h2 className="text-5xl font-bold text-secondary uppercase tracking-tight">{userName}</h2>
                        <p className="text-xl text-gray-400 italic font-medium">adlı çalışanımızın;</p>
                        
                        <div className="bg-gray-50/50 py-8 px-10 rounded-3xl border border-gray-100 my-4">
                            <h3 className="text-3xl font-black text-primary leading-tight">{trainingName}</h3>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed px-12 font-medium">
                            başlıklı eğitim modülünü ve beraberindeki değerlendirme sınavını başarıyla tamamlayarak, yetkinliğini kanıtladığı için verilmiştir.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end px-16 mb-6">
                        <div className="text-center">
                            <p className="text-xl font-bold text-secondary border-b-2 border-gray-100 pb-2 mb-2 w-48">{date}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Düzenlenme Tarihi</p>
                        </div>
                        
                        <div className="text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-2 border border-primary/10 relative">
                                <span className="text-3xl">🏅</span>
                            </div>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">Resmi Onay</p>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Doğrulama Kodu</p>
                            <p className="text-xs font-mono text-secondary bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 font-bold">{certNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile scaling logic inline style */}
            <style jsx>{`
                div {
                    --cert-scale: 1;
                }
                @media (max-width: 1040px) {
                    div { --cert-scale: ${typeof window !== 'undefined' ? (window.innerWidth - 64) / 1000 : 0.8}; }
                }
                @media (max-width: 640px) {
                    div { --cert-scale: ${typeof window !== 'undefined' ? (window.innerWidth - 32) / 1000 : 0.4}; }
                }
            `}</style>
            
            {/* Fallback for when JS window size isn't ready or for better CSS-only scaling */}
            <div className="hidden">
                {/* CSS only scaling is tricky without container queries, 
                    so the overflow-x-auto is the safest fallback */}
            </div>
        </div>
    );
}

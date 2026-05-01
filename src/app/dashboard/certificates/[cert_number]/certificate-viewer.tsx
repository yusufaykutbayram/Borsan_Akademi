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
}

export function CertificateViewer({ certNumber, userName, trainingName, date }: CertificateViewerProps) {
    const certRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const btn = document.getElementById('download-btn');
        if (!btn) return;

        const handleDownload = async () => {
            if (!certRef.current) return;
            
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = 'PDF Hazırlanıyor...';
            btn.setAttribute('disabled', 'true');

            try {
                const canvas = await html2canvas(certRef.current, {
                    scale: 3, // High quality
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                // A4 size landscape
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
    }, [certNumber]);

    return (
        <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden rounded-sm relative" style={{ aspectRatio: '1.414/1' }}>
            <div ref={certRef} className="absolute inset-0 p-12 bg-white flex flex-col items-center justify-between" style={{ border: '20px solid #f8fafc', boxSizing: 'border-box' }}>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary opacity-20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary opacity-20"></div>

                {/* Header */}
                <div className="text-center mt-8">
                    <div className="flex justify-center mb-6">
                        {/* Assuming the logo is at public/images/logo.png */}
                        <Image src="/images/logo.png" alt="Borsan Logo" width={200} height={50} className="object-contain" />
                    </div>
                    <h1 className="text-5xl font-black text-secondary tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Başarı Sertifikası</h1>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                {/* Body */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <p className="text-xl text-gray-500 italic">Bu sertifika,</p>
                    <h2 className="text-4xl font-bold text-secondary uppercase tracking-wider">{userName}</h2>
                    <p className="text-xl text-gray-500 italic">adlı çalışanımıza;</p>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-6">
                        <h3 className="text-2xl font-bold text-primary">{trainingName}</h3>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed px-8">
                        başlıklı eğitimi ve bu eğitime ait değerlendirme sınavını üstün bir başarıyla tamamlayarak bu sertifikayı kazanmaya hak kazandığı için verilmiştir.
                    </p>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between items-end px-12 mb-8">
                    <div className="text-center">
                        <p className="text-lg font-bold text-secondary border-b-2 border-gray-200 pb-2 mb-2 w-48">{date}</p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Veriliş Tarihi</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20 relative">
                            <span className="text-3xl">🏅</span>
                            <div className="absolute -bottom-2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                ONAYLI
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-400 mb-1">Sertifika Kodu</p>
                        <p className="text-sm font-mono text-secondary bg-gray-50 px-4 py-2 rounded border border-gray-200">{certNumber}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

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
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const btn = document.getElementById(downloadBtnId);
        if (!btn) return;

        const handleDownload = async () => {
            if (!exportRef.current) return;
            
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = 'Hazırlanıyor...';
            btn.setAttribute('disabled', 'true');

            try {
                // Scroll to top to avoid clipping issues with fixed elements
                window.scrollTo(0, 0);

                // Temporarily show the export element to capture it
                const el = exportRef.current;
                el.style.display = 'block';
                el.style.position = 'absolute';
                el.style.left = '0';
                el.style.top = '0';
                el.style.zIndex = '-9999';

                const canvas = await html2canvas(el, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: 1123,
                    height: 794,
                    windowWidth: 1123,
                    windowHeight: 794
                });

                el.style.display = 'none';

                const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
        <div className="w-full flex flex-col items-center">
            {/* 1. VISUAL DISPLAY - MOBILE FRIENDLY */}
            <div className="w-full max-w-2xl bg-white border-8 border-gray-50 p-4 sm:p-10 rounded-xl shadow-lg relative flex flex-col items-center text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center mb-2">
                    <Image src="/images/logo.png" alt="Logo" width={120} height={30} className="object-contain" />
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-black text-secondary uppercase tracking-widest">Sertifika</h1>
                <div className="w-12 h-1 bg-primary rounded-full"></div>

                <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-gray-400 italic font-medium">Bu belge sayın</p>
                    <h2 className="text-xl sm:text-3xl font-bold text-secondary uppercase">{userName}</h2>
                    <p className="text-xs sm:text-sm text-gray-400 italic font-medium">adlı çalışanımıza;</p>
                </div>

                <div className="bg-gray-50 py-4 px-6 rounded-2xl border border-gray-100 w-full">
                    <h3 className="text-sm sm:text-xl font-black text-primary leading-tight">{trainingName}</h3>
                </div>

                <p className="text-xs sm:text-base text-gray-600 leading-relaxed font-medium">
                    başlıklı eğitimi ve sınavını başarıyla tamamladığı için verilmiştir.
                </p>

                <div className="w-full flex justify-between items-end pt-4 border-t border-gray-100">
                    <div className="text-left">
                        <p className="text-xs sm:text-sm font-bold text-secondary">{date}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black">Tarih</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Sertifika Kodu</p>
                        <p className="text-[10px] font-mono text-secondary bg-gray-50 px-2 py-1 rounded border border-gray-200 font-bold">{certNumber}</p>
                    </div>
                </div>
            </div>

            {/* 2. HIDDEN EXPORT VERSION - FIXED SIZE FOR CLEAN PDF */}
            <div 
                ref={exportRef} 
                style={{ 
                    display: 'none', 
                    width: '1123px', 
                    height: '794px', 
                    padding: '60px',
                    backgroundColor: 'white',
                    fontFamily: 'sans-serif'
                }}
            >
                <div style={{ 
                    border: '20px solid #f8fafc', 
                    height: '100%', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative'
                }}>
                    {/* Corners */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', borderTop: '10px solid #E30613', borderLeft: '10px solid #E30613', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', borderTop: '10px solid #E30613', borderRight: '10px solid #E30613', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100px', height: '100px', borderBottom: '10px solid #E30613', borderLeft: '10px solid #E30613', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', borderBottom: '10px solid #E30613', borderRight: '10px solid #E30613', opacity: 0.2 }}></div>

                    <div style={{ textAlign: 'center' }}>
                        <img src="/images/logo.png" alt="Logo" style={{ height: '60px', marginBottom: '30px' }} />
                        <h1 style={{ fontSize: '60px', margin: '0 0 10px 0', fontWeight: '900', color: '#1a1a1a', letterSpacing: '10px', textTransform: 'uppercase' }}>BAŞARI SERTİFİKASI</h1>
                        <div style={{ width: '100px', height: '4px', backgroundColor: '#E30613', margin: '0 auto' }}></div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
                        <p style={{ fontSize: '24px', color: '#666', fontStyle: 'italic' }}>Bu sertifika,</p>
                        <h2 style={{ fontSize: '50px', color: '#1a1a1a', margin: 0, fontWeight: 'bold' }}>{userName.toUpperCase()}</h2>
                        <p style={{ fontSize: '24px', color: '#666', fontStyle: 'italic' }}>adlı çalışanımıza;</p>
                        <div style={{ padding: '30px', backgroundColor: '#f9fafb', borderRadius: '30px', border: '2px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '36px', color: '#E30613', margin: 0, fontWeight: '900' }}>{trainingName}</h3>
                        </div>
                        <p style={{ fontSize: '22px', color: '#4b5563', maxWidth: '800px', lineHeight: '1.6' }}>
                            başlıklı eğitimi ve bu eğitime ait değerlendirme sınavını başarıyla tamamlayarak, bu sertifikayı kazanmaya hak kazandığı için verilmiştir.
                        </p>
                    </div>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '10px', minWidth: '200px' }}>{date}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px' }}>Tarih</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                             <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Doğrulama Kodu</p>
                             <p style={{ fontSize: '14px', fontFamily: 'monospace', padding: '10px 20px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>{certNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

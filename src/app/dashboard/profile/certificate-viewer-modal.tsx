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
                window.scrollTo(0, 0);
                const el = exportRef.current;
                el.style.display = 'block';
                el.style.position = 'absolute';
                el.style.left = '0';
                el.style.top = '0';
                el.style.zIndex = '-9999';

                const canvas = await html2canvas(el, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: 1123,
                    height: 900, // Safe height
                    windowWidth: 1123,
                    windowHeight: 900,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0
                });

                el.style.display = 'none';

                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                const pdf = new jsPDF('l', 'mm', [297, 210]); // Explicit A4 Landscape
                pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
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
            <div className="w-full max-w-xl bg-white border-8 border-gray-50 p-6 sm:p-10 rounded-xl shadow-lg relative flex flex-col items-center text-center space-y-4 sm:space-y-6 overflow-hidden">
                <div className="flex justify-center mb-2">
                    <Image src="/images/logo.png" alt="Logo" width={100} height={25} className="object-contain" />
                </div>
                
                <h1 className="text-xl sm:text-3xl font-black text-secondary uppercase tracking-widest">Sertifika</h1>
                <div className="w-10 h-1 bg-primary rounded-full"></div>

                <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs text-gray-400 italic">Bu belge sayın</p>
                    <h2 className="text-lg sm:text-2xl font-bold text-secondary uppercase">{userName}</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 italic">adlı çalışanımıza;</p>
                </div>

                <div className="bg-gray-50 py-3 px-4 rounded-xl border border-gray-100 w-full">
                    <h3 className="text-xs sm:text-lg font-black text-primary leading-tight">{trainingName}</h3>
                </div>

                <p className="text-[10px] sm:text-sm text-gray-600 leading-relaxed font-medium px-2">
                    başlıklı eğitimi ve sınavını başarıyla tamamladığı için verilmiştir.
                </p>

                <div className="w-full flex justify-between items-end pt-4 border-t border-gray-100 mt-2">
                    <div className="text-left">
                        <p className="text-[10px] sm:text-xs font-bold text-secondary">{date}</p>
                        <p className="text-[7px] text-gray-400 uppercase font-black">Tarih</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[7px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Kod</p>
                        <p className="text-[8px] font-mono text-secondary bg-gray-50 px-2 py-1 rounded border border-gray-200 font-bold">{certNumber}</p>
                    </div>
                </div>
            </div>

            {/* 2. HIDDEN EXPORT VERSION - FIXED SIZE & SIMPLIFIED LAYOUT */}
            <div 
                ref={exportRef} 
                style={{ 
                    display: 'none', 
                    width: '1123px', 
                    height: '794px', 
                    backgroundColor: 'white',
                }}
            >
                <div style={{ 
                    padding: '40px',
                    height: '100%',
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '30px solid #f8fafc',
                    position: 'relative',
                    textAlign: 'center',
                    fontFamily: 'sans-serif'
                }}>
                    <img src="/images/logo.png" alt="Logo" style={{ height: '50px', marginTop: '20px' }} />
                    
                    <h1 style={{ fontSize: '54px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '12px', marginTop: '30px', marginBottom: '10px' }}>BAŞARI SERTİFİKASI</h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: '#E30613', margin: '0 auto' }}></div>

                    <div style={{ marginTop: '50px' }}>
                        <p style={{ fontSize: '22px', color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>Bu belge,</p>
                        <h2 style={{ fontSize: '48px', color: '#1a1a1a', margin: '0 0 20px 0', fontWeight: 'bold' }}>{userName.toUpperCase()}</h2>
                        <p style={{ fontSize: '22px', color: '#666', fontStyle: 'italic', marginBottom: '40px' }}>adlı çalışanımıza;</p>
                        
                        <div style={{ 
                            padding: '25px 40px', 
                            backgroundColor: '#f9fafb', 
                            borderRadius: '25px', 
                            border: '2px solid #f3f4f6',
                            display: 'inline-block',
                            maxWidth: '900px'
                        }}>
                            <h3 style={{ fontSize: '32px', color: '#E30613', margin: 0, fontWeight: '900', lineHeight: '1.2' }}>{trainingName}</h3>
                        </div>

                        <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '850px', margin: '40px auto', lineHeight: '1.5' }}>
                            başlıklı eğitimi ve bu eğitime ait değerlendirme sınavını başarıyla tamamlayarak, bu sertifikayı kazanmaya hak kazandığı için verilmiştir.
                        </p>
                    </div>

                    {/* Fixed Position Footer to prevent overflow pushing it out */}
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '60px', 
                        left: '80px', 
                        right: '80px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '20px'
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{date}</p>
                            <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Düzenlenme Tarihi</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                             <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Doğrulama Kodu</p>
                             <p style={{ fontSize: '14px', fontFamily: 'monospace', padding: '8px 15px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', margin: 0 }}>{certNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                // IMPORTANT: html2canvas works best when the element is actually in the DOM and visible (but can be off-screen)
                const el = exportRef.current;
                el.style.display = 'block';
                
                // Use a very high scale for print quality
                const canvas = await html2canvas(el, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    width: 1123,
                    height: 794,
                    onclone: (clonedDoc) => {
                        // Ensure the cloned element is visible
                        const clonedEl = clonedDoc.getElementById('certificate-export-container');
                        if (clonedEl) {
                            clonedEl.style.display = 'block';
                        }
                    }
                });

                el.style.display = 'none';

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jsPDF('l', 'mm', 'a4');
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
            {/* 1. VISUAL DISPLAY - MOBILE FRIENDLY PREVIEW */}
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

            {/* 2. EXPORT VERSION - ULTRA STABLE BOX MODEL */}
            {/* This is kept in the DOM but hidden/off-screen to ensure fonts and styles are loaded */}
            <div className="fixed -left-[5000px] top-0">
                <div 
                    ref={exportRef} 
                    id="certificate-export-container"
                    style={{ 
                        width: '1123px', 
                        height: '794px', 
                        backgroundColor: 'white',
                        position: 'relative',
                        boxSizing: 'border-box',
                        display: 'none' // Controlled by JS during capture
                    }}
                >
                    <div style={{ 
                        width: '1063px',
                        height: '734px',
                        margin: '30px',
                        border: '20px solid #f8fafc',
                        boxSizing: 'border-box',
                        position: 'relative',
                        padding: '60px',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {/* Background watermark or corner elements if needed */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '150px', borderTop: '8px solid #E30613', borderLeft: '8px solid #E30613', opacity: 0.1 }}></div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '150px', height: '150px', borderBottom: '8px solid #E30613', borderRight: '8px solid #E30613', opacity: 0.1 }}></div>

                        <div style={{ marginBottom: '40px' }}>
                            <img src="/images/logo.png" alt="Logo" style={{ height: '50px', display: 'block', margin: '0 auto 30px' }} />
                            <h1 style={{ fontSize: '60px', fontWeight: 'bold', color: '#111827', letterSpacing: '15px', margin: '0 0 10px' }}>BAŞARI SERTİFİKASI</h1>
                            <div style={{ width: '100px', height: '4px', backgroundColor: '#E30613', margin: '0 auto' }}></div>
                        </div>

                        <div style={{ marginTop: '60px' }}>
                            <p style={{ fontSize: '24px', color: '#6B7280', fontStyle: 'italic', margin: '0 0 20px' }}>Bu belge,</p>
                            <h2 style={{ fontSize: '56px', color: '#111827', margin: '0 0 20px', fontWeight: 'bold', textTransform: 'uppercase' }}>{userName}</h2>
                            <p style={{ fontSize: '24px', color: '#6B7280', fontStyle: 'italic', margin: '0 0 40px' }}>adlı çalışanımıza;</p>
                            
                            <div style={{ 
                                padding: '30px 50px', 
                                backgroundColor: '#F9FAFB', 
                                borderRadius: '30px', 
                                border: '2px solid #F3F4F6',
                                display: 'inline-block',
                                maxWidth: '850px'
                            }}>
                                <h3 style={{ fontSize: '36px', color: '#E30613', margin: 0, fontWeight: 'bold' }}>{trainingName}</h3>
                            </div>

                            <p style={{ fontSize: '22px', color: '#374151', maxWidth: '800px', margin: '40px auto', lineHeight: '1.6' }}>
                                başlıklı eğitimi ve bu eğitime ait değerlendirme sınavını başarıyla tamamlayarak, bu sertifikayı kazanmaya hak kazandığı için verilmiştir.
                            </p>
                        </div>

                        {/* Footer - Absolute to prevent shifting */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '80px', 
                            left: '100px', 
                            right: '100px', 
                            borderTop: '2px solid #F3F4F6',
                            paddingTop: '30px',
                            display: 'table',
                            width: 'calc(100% - 200px)'
                        }}>
                            <div style={{ display: 'table-cell', textAlign: 'left', width: '50%' }}>
                                <p style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 5px', color: '#111827' }}>{date}</p>
                                <p style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>DÜZENLENME TARİHİ</p>
                            </div>
                            <div style={{ display: 'table-cell', textAlign: 'right', width: '50%', verticalAlign: 'bottom' }}>
                                 <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '1px' }}>DOĞRULAMA KODU</p>
                                 <p style={{ fontSize: '16px', fontFamily: 'monospace', padding: '10px 20px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', margin: 0, display: 'inline-block', fontWeight: 'bold', color: '#111827' }}>{certNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

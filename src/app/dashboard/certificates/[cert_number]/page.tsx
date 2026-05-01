import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CertificateViewer } from "./certificate-viewer";

export default async function CertificatePage({ params }: any) {
    const resolvedParams = await params;
    const certNumber = resolvedParams?.cert_number;
    const session = await auth();
    
    if (!session) redirect("/login");

    const certificate = await prisma.certificate.findUnique({
        where: { cert_number: certNumber },
        include: {
            user: true,
            training: true
        }
    });

    if (!certificate || certificate.user_id !== session.user.id) {
        return notFound();
    }

    return (
        <div className="py-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-secondary">Eğitim Sertifikası</h1>
                    <p className="text-gray-400 font-medium">Bu belge, eğitimi başarıyla tamamladığınızı doğrular.</p>
                </div>
                <button 
                    id="download-btn"
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    PDF Olarak İndir
                </button>
            </div>

            <CertificateViewer 
                certNumber={certificate.cert_number}
                userName={certificate.user.name}
                trainingName={certificate.training.title}
                date={certificate.issued_at.toLocaleDateString('tr-TR')}
            />
        </div>
    );
}

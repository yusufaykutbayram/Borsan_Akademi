import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PerformanceCard } from "./performance-card";
import { MandatoryTrainingsAccordion } from "./mandatory-trainings-accordion";
import { MachineLicensesAccordion } from "./machine-licenses-accordion";
import { ProfileImageUpload } from "./profile-image-upload";
import { PasswordChangeForm } from "./password-change-form";
import { FeedbackForm } from "./feedback-form";

export default async function ProfilePage() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        include: { 
            user_badges: { include: { badge: true } }, 
            certificates: true,
            performance_evals: {
                include: { metrics: true },
                orderBy: { evaluated_at: 'desc' }
            },
            training_progress: {
                where: { is_mandatory: true },
                include: { training: true },
                orderBy: { updated_at: 'desc' }
            },
            machine_licenses: {
                orderBy: { score: 'desc' }
            }
        }
    });

    const mandatoryTrainings = user?.training_progress || [];
    const machineLicenses = user?.machine_licenses || [];


    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header / Avatar Section */}
            <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 shadow-soft border border-gray-100 flex flex-col items-center text-center relative">
                <div className="absolute top-8 right-8">
                    <FeedbackForm />
                </div>
                <ProfileImageUpload 
                    initialImage={user?.avatar_url || null} 
                    name={user?.name || ""} 
                />
                
                <div className="mt-8 space-y-2">
                    <h1 className="text-3xl font-black text-secondary tracking-tight">{user?.name}</h1>
                    <p className="text-gray-400 font-medium">{user?.position || "Borsan Akademi Çalışanı"}</p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                        {user?.factory && <span>{user.factory}</span>}
                        {user?.department && (
                            <>
                                <span className="hidden sm:inline opacity-30">•</span>
                                <span>{user.department}</span>
                            </>
                        )}
                        {user?.start_date && (
                            <>
                                <span className="hidden sm:inline opacity-30">•</span>
                                <span>Giriş: {new Date(user.start_date).toLocaleDateString('tr-TR')}</span>
                            </>
                        )}
                        {user?.sicil_no && (
                            <>
                                <span className="hidden sm:inline opacity-30">•</span>
                                <span>Sicil No: {user.sicil_no}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex gap-3">
                    <div className="px-8 py-3 bg-surface rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Toplam Puan</p>
                        <p className="text-2xl font-black text-secondary">{user?.xp_points} <span className="text-xs text-primary">XP</span></p>
                    </div>
                    <div className="px-8 py-3 bg-surface rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rozetler</p>
                        <p className="text-2xl font-black text-secondary">{user?.user_badges.length}</p>
                    </div>
                    <div className="px-6 py-3 bg-surface rounded-2xl border border-gray-100 min-w-[120px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hak Edilen</p>
                        <p className="text-xl font-black text-secondary">{user?.annual_leave_entitled || 0} <span className="text-[10px] text-gray-400">GÜN</span></p>
                    </div>
                    <div className="px-6 py-3 bg-surface rounded-2xl border border-gray-100 min-w-[120px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kullanılan</p>
                        <p className="text-xl font-black text-secondary">{user?.annual_leave_used || 0} <span className="text-[10px] text-gray-400">GÜN</span></p>
                    </div>
                    <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100 min-w-[120px]">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Kalan İzin</p>
                        <p className="text-xl font-black text-secondary">{user?.annual_leave_remaining || 0} <span className="text-[10px] text-red-500">GÜN</span></p>
                    </div>
                    <div className="px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100 min-w-[140px]">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Hak Ediş Tarihi</p>
                        <p className="text-sm font-black text-secondary">
                            {user?.annual_leave_entitlement_date 
                                ? new Date(user.annual_leave_entitlement_date).toLocaleDateString('tr-TR')
                                : "-"
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Mandatory Trainings Accordion */}
            <MandatoryTrainingsAccordion trainings={mandatoryTrainings} />

            {/* Machine Licenses Accordion */}
            <MachineLicensesAccordion 
                licenses={machineLicenses} 
                user={{
                    name: user?.name || "",
                    sicil_no: user?.sicil_no,
                    department: user?.department,
                    position: user?.position
                }} 
            />

            {/* Performance Evaluations Section */}
            <section className="space-y-6">
                <h3 className="text-2xl font-bold text-secondary">Performans Geçmişi</h3>
                <div className="grid grid-cols-1 gap-6">
                    {user?.performance_evals.map(evaluation => (
                        <PerformanceCard key={evaluation.id} evaluation={evaluation} />
                    ))}
                    {(user?.performance_evals.length || 0) === 0 && (
                        <div className="py-12 bg-surface rounded-3xl border border-dashed border-gray-200 text-center">
                            <p className="text-gray-400 text-sm">Henüz performans değerlendirmesi bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                {/* Badges Section */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-secondary">Kazanılan Rozetler</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {user?.user_badges.map(ub => (
                            <div key={ub.id} className="bg-white p-6 rounded-3xl shadow-soft border border-gray-50 flex flex-col items-center text-center transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="text-4xl mb-4">{ub.badge.icon_id}</div>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{ub.badge.name}</p>
                            </div>
                        ))}
                        {(user?.user_badges.length || 0) === 0 && (
                            <div className="col-span-3 py-12 bg-surface rounded-3xl border border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 text-sm">Henüz rozet kazanılmadı.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Certificates Section */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-secondary">Sertifikalarım</h3>
                    <div className="space-y-4">
                        {user?.certificates.map(cert => (
                            <div key={cert.id} className="bg-white p-6 rounded-3xl shadow-soft border border-gray-50 flex justify-between items-center group transition-all hover:border-primary/20">
                                <div>
                                    <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">Eğitim Sertifikası</p>
                                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{cert.cert_number}</span>
                                </div>
                                <a 
                                    href={cert.url} 
                                    target="_blank" 
                                    className="px-6 py-2 bg-surface hover:bg-primary hover:text-white text-secondary rounded-xl font-bold text-xs transition-all border border-gray-100 hover:border-primary"
                                >
                                    İndir
                                </a>
                            </div>
                        ))}
                        {(user?.certificates.length || 0) === 0 && (
                            <div className="py-12 bg-surface rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
                                <span className="text-4xl block opacity-20 grayscale">📜</span>
                                <p className="text-gray-400 text-sm">Henüz sertifika bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Password Change Section */}
            <PasswordChangeForm />
        </div>
    )
}

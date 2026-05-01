import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const settings = await prisma.systemSetting.findMany();
    
    // Convert to simple object map
    const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-secondary tracking-tight">Sistem Ayarları</h1>
                    <p className="text-gray-400 font-medium mt-2">E-posta bildirimleri ve diğer teknik yapılandırmalar.</p>
                </div>
            </div>

            <SettingsForm initialSettings={settingsMap} />
        </div>
    );
}

import { prisma } from "@/lib/prisma"
import { AddUserForm } from "./add-user-form"
import { PersonnelImportButton } from "./personnel-import-button"
import { UserTableClient } from "./user-table-client"

// Dynamically rendering
export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Kullanıcı Yönetimi</h1>
            
            <div className="flex flex-wrap gap-4 items-start mb-8">
                <PersonnelImportButton />
                <div style={{ flex: 1 }}>
                     <AddUserForm />
                </div>
            </div>

            <UserTableClient users={users} />
        </div>
    )
}

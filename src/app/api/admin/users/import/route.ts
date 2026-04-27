import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)
        
        const worksheet = workbook.worksheets[0]
        const usersToImport: any[] = []

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const sicil_no = row.getCell(1).text.trim()
            const name = row.getCell(2).text.trim()
            const department = row.getCell(3).text.trim()
            const start_date_val = row.getCell(4).value
            const factory = row.getCell(6).text.trim()
            const position = row.getCell(7).text.trim()

            if (sicil_no && name) {
                let start_date: Date | null = null
                if (start_date_val instanceof Date) {
                    start_date = start_date_val
                } else if (typeof start_date_val === 'number') {
                    // Excel number to JS date
                    start_date = new Date(Math.round((start_date_val - 25569) * 86400 * 1000))
                }

                usersToImport.push({
                    sicil_no,
                    name,
                    department,
                    start_date,
                    factory,
                    position
                })
            }
        })

        let importedCount = 0
        for (const u of usersToImport) {
            // Only hash if user doesn't exist, or if we want to reset password?
            // User said registration number is the password.
            
            const existingUser = await prisma.user.findUnique({ where: { sicil_no: u.sicil_no } })
            
            if (existingUser) {
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        name: u.name,
                        department: u.department,
                        start_date: u.start_date,
                        factory: u.factory,
                        position: u.position,
                    }
                })
            } else {
                const hashedPassword = await bcrypt.hash(u.sicil_no, 10)
                await prisma.user.create({
                    data: {
                        name: u.name,
                        sicil_no: u.sicil_no,
                        department: u.department,
                        start_date: u.start_date,
                        factory: u.factory,
                        position: u.position,
                        password_hash: hashedPassword,
                        role: 'EMPLOYEE',
                        force_pw_change: true
                    }
                })
            }
            importedCount++
        }

        return NextResponse.json({ success: true, message: `${importedCount} çalışan başarıyla kaydedildi.` })
    } catch (error: any) {
        console.error("Import error:", error)
        return NextResponse.json({ error: "Hata: " + error.message }, { status: 500 })
    }
}

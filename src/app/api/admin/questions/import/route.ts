import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import ExcelJS from "exceljs"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const category = (formData.get('category') as string) || "DIĞER"

        if (!file || !title) {
            return NextResponse.json({ error: "Dosya ve başlık zorunludur" }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)
        
        const worksheet = workbook.worksheets[0]
        const questionsData: any[] = []

        let currentQuestion: string | null = null
        let currentAnswers: any[] = []

        worksheet.eachRow({ includeEmpty: true }, (row) => {
            const getVal = (col: number) => {
                const cell = row.getCell(col)
                if (cell.isMerged && cell.master.address !== cell.address) {
                    return cell.master.value ? cell.master.value.toString() : ""
                }
                return cell.value ? cell.value.toString() : ""
            }

            const getArgb = (col: number) => {
                const cell = row.getCell(col)
                const targetCell = (cell.isMerged) ? cell.master : cell
                if (targetCell.fill && 'fgColor' in targetCell.fill) {
                    return (targetCell.fill.fgColor as any)?.argb || ""
                }
                return ""
            }

            const c1 = getVal(1).trim()
            const c3 = getVal(3).trim()
            const c5 = getVal(5).trim()
            const c7 = getVal(7).trim()

            const hasA = c1.startsWith("A)")
            const hasB = c1.startsWith("B)") || c3.startsWith("B)")
            const hasC = c5.startsWith("C)") || c3.startsWith("C)") || c1.startsWith("C)")
            const hasD = c7.startsWith("D)") || c5.startsWith("D)")

            if (hasA || hasB || hasC || hasD) {
                for (let i = 1; i <= 8; i++) {
                    const val = getVal(i).trim()
                    if (val.match(/^[A-D]\)/)) {
                        const text = getVal(i + 1).trim()
                        const argb = getArgb(i).toUpperCase()
                        const isCorrect = argb.includes("FFFF00") || argb.includes("FEFF00") || argb === "FFFFFF00"
                        
                        if (text) {
                            currentAnswers.push({ text, is_correct: isCorrect })
                        }
                    }
                }

                if (currentAnswers.length >= 4 || hasD) {
                    if (currentQuestion && currentAnswers.length > 0) {
                        questionsData.push({ text: currentQuestion, answers: [...currentAnswers] })
                    }
                    currentQuestion = null
                    currentAnswers = []
                }
            } 
            else if (c1 && c1.length > 8 && !c1.includes("A)") && !c1.includes("B)")) {
                if (currentQuestion && currentAnswers.length > 0) {
                    questionsData.push({ text: currentQuestion, answers: [...currentAnswers] })
                    currentAnswers = []
                }
                currentQuestion = c1
            }
        })

        if (currentQuestion && currentAnswers.length > 0) {
            questionsData.push({ text: currentQuestion, answers: currentAnswers })
        }

        if (questionsData.length === 0) {
            return NextResponse.json({ error: "Soru bulunamadı." }, { status: 400 })
        }

        if (questionsData.length < 10 || questionsData.length > 20) {
            return NextResponse.json({ error: `Bir sınavda en az 10, en fazla 20 soru olmalıdır. Sizin eklediğiniz soru sayısı: ${questionsData.length}` }, { status: 400 })
        }

        // --- DATABASE OPERATIONS ---
        
        // 1. Create a Training record of type 'QUIZ'
        const training = await prisma.training.create({
            data: {
                title: title,
                description: `${questionsData.length} soruluk quiz eğitimi.`,
                type: 'QUIZ',
                category: category,
            }
        })

        // 2. Create an Exam for this training
        const exam = await prisma.exam.create({
            data: {
                training_id: training.id,
                title: title,
                pass_threshold: 70
            }
        })

        // 3. Create all questions and link to the exam
        for (const qData of questionsData) {
            await prisma.question.create({
                data: {
                    text: qData.text,
                    category: category,
                    exam_id: exam.id, // Linked to the specific exam/training
                    time_limit: 20,
                    answers: {
                        create: qData.answers
                    }
                }
            })
        }

        return NextResponse.json({ 
            success: true, 
            message: `"${title}" quizi ve ${questionsData.length} soru başarıyla oluşturuldu.`
        })

    } catch (error: any) {
        console.error("Import error:", error)
        return NextResponse.json({ error: "İşlem sırasında hata oluştu: " + error.message }, { status: 500 })
    }
}

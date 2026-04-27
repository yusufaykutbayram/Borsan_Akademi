const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const filePath = path.join(__dirname, 'PERFORMANS DEĞERLENDİRME MAYIS-TEMMUZ DÖNEMİ.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const period = "MAYIS-TEMMUZ 2024";
    console.log(`Starting performance import for ${period}...`);

    // Row 0 is weights (max scores)
    const weightsRow = data[0];
    const metrics = [
        { key: 'Hat performansı \r\nsonuçları', label: 'Hat Performansı' },
        { key: 'Fireler\r\n(Mühendislik fireleri \r\ndışında oluşan hurdalar)', label: 'Fire Oranı' },
        { key: 'Kalite odaklı yaklaşım\r\n(Sıfır hatalı üretim yapmak)', label: 'Kalite' },
        { key: 'Devamlılık', label: 'Devamlılık' },
        { key: 'Tutanaklar', label: 'Tutanaklar' },
        { key: 'Mola Süresine Uyum', label: 'Mola Uyumu' },
        { key: 'İlişki Yönetimi', label: 'İlişki Yönetimi' },
        { key: 'Fazla Mesaiye katılım ', label: 'Fazla Mesai' },
        { key: 'Hattının 5S puanı', label: '5S Puanı' }
    ];

    // Employees start from row 1
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const sicilNo = String(row['__EMPTY']);
        const grade = row['PERFORMANS KATEGORSİ'];
        const totalScore = parseFloat(row['Genel \r\nToplam \r\nPuan']);

        if (!sicilNo || !grade) continue;

        const user = await prisma.user.findUnique({ where: { sicil_no: sicilNo } });
        if (!user) {
            console.warn(`User not found for sicil_no: ${sicilNo}`);
            continue;
        }

        try {
            // Delete existing for this period to avoid duplicates
            const existing = await prisma.performanceEvaluation.findUnique({
                where: { user_id_period: { user_id: user.id, period } }
            });
            if (existing) {
                await prisma.performanceEvaluation.delete({ where: { id: existing.id } });
            }

            const evaluation = await prisma.performanceEvaluation.create({
                data: {
                    user_id: user.id,
                    period,
                    final_grade: grade,
                    total_score: totalScore,
                    metrics: {
                        create: metrics.map(m => ({
                            title: m.label,
                            score: parseFloat(row[m.key] || 0),
                            max_score: parseFloat(weightsRow[m.key] || 0) * 100
                        }))
                    }
                }
            });

            console.log(`Imported performance for: ${user.name} (${sicilNo}) - Grade: ${grade}`);
        } catch (error) {
            console.error(`Error importing performance for ${user.name}:`, error.message);
        }
    }

    console.log('Performance import completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

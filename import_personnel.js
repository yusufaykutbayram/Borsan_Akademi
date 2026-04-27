const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const path = require('path');

const prisma = new PrismaClient();

function excelDateToJSDate(serial) {
    if (!serial) return null;
    // Excel date is days since 1900-01-01
    // 25569 is the offset for 1970-01-01
    return new Date(Math.round((serial - 25569) * 86400 * 1000));
}

async function main() {
    const filePath = path.join(__dirname, 'ZAYIF AKIM PERSONEL LİSTESİ.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Starting import of ${data.length} employees...`);

    for (const row of data) {
        const sicilNo = String(row['SİCİL NO ']);
        const name = row['AD SOYAD '];
        const department = row['ÇALIŞTIĞI HAT '];
        const startDate = excelDateToJSDate(row['İSTİHDAM TARİHİ']);
        const factory = row['FABRİKA'];
        const position = row['POZİSYON '];

        if (!sicilNo || !name) {
            console.warn(`Skipping invalid row:`, row);
            continue;
        }

        const hashedPassword = await bcrypt.hash(sicilNo, 10);

        try {
            await prisma.user.upsert({
                where: { sicil_no: sicilNo },
                update: {
                    name,
                    department,
                    start_date: startDate,
                    factory,
                    position,
                    force_pw_change: true
                },
                create: {
                    name,
                    sicil_no: sicilNo,
                    department,
                    start_date: startDate,
                    factory,
                    position,
                    password_hash: hashedPassword,
                    role: 'EMPLOYEE',
                    force_pw_change: true
                }
            });
            console.log(`Imported: ${name} (${sicilNo})`);
        } catch (error) {
            console.error(`Error importing ${name}:`, error.message);
        }
    }

    console.log('Import completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

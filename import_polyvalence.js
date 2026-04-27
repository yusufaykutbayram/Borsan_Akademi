const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Polyvalence Import ---');

    const workbook = XLSX.readFile('Zayıf Akım Polivalans Tablosu.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const users = await prisma.user.findMany();
    const userMap = new Map();
    users.forEach(u => userMap.set(u.name.trim().toUpperCase(), u));

    // Headers are in Row 1 (Index 1)
    const headers = data[1];
    const machineLines = headers.slice(5, 16); // Columns 5 to 15

    let importCount = 0;

    // Data starts from Row 3 (Index 3) based on analyze output
    for (let i = 3; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length < 2) continue;

        const personnelName = row[1];
        if (!personnelName) continue;

        const user = userMap.get(personnelName.trim().toUpperCase());
        if (!user) {
            // console.log(`User not found: ${personnelName}`);
            continue;
        }

        for (let j = 0; j < machineLines.length; j++) {
            const lineName = machineLines[j];
            const scoreValue = row[j + 5];
            const score = parseInt(scoreValue) || 0;

            if (score > 0) {
                const isValid = score >= 2;
                let level = "Geçersiz";
                if (score === 2) level = "Temel";
                else if (score === 3) level = "İyi";
                else if (score === 4) level = "Uzman";

                try {
                    await prisma.machineLicense.upsert({
                        where: {
                            user_id_line_name: {
                                user_id: user.id,
                                line_name: lineName
                            }
                        },
                        update: {
                            score: score,
                            level: level,
                            is_valid: isValid
                        },
                        create: {
                            user_id: user.id,
                            line_name: lineName,
                            score: score,
                            level: level,
                            is_valid: isValid
                        }
                    });
                    importCount++;
                } catch (err) {
                    console.error(`Error importing license for ${personnelName} on ${lineName}:`, err.message);
                }
            }
        }
    }

    console.log(`\n--- Import Finished ---`);
    console.log(`Total licenses created/updated: ${importCount}`);
}

main()
    .catch(e => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

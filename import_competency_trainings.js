const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Competency Training Import ---');

    // 1. Read Excel Files
    const matrixWb = XLSX.readFile('ÇALIŞAN YETKİNLİK MATRİSİ.xlsx');
    const matrixData = XLSX.utils.sheet_to_json(matrixWb.Sheets[matrixWb.SheetNames[0]], { header: 1 });

    const mappingWb = XLSX.readFile('EĞİTİM EŞLEŞTİRME LİSTESİ.xlsx');
    const mappingData = XLSX.utils.sheet_to_json(mappingWb.Sheets[mappingWb.SheetNames[0]], { header: 1 });

    // 2. Load DB Data
    const users = await prisma.user.findMany();
    const existingTrainings = await prisma.training.findMany();
    
    const userMap = new Map();
    users.forEach(u => userMap.set(u.name.trim().toUpperCase(), u));

    const trainingMap = new Map(); // Title -> Training Object
    existingTrainings.forEach(t => trainingMap.set(t.title.trim().toUpperCase(), t));

    // 3. Process Mappings
    // Category -> Array of Training Objects
    const categoryToTrainings = new Map();

    for (const row of mappingData) {
        if (!row || row.length === 0) continue;
        const categoryName = row[0];
        const contentTitles = row.slice(1).filter(t => t && t.trim() !== '');

        const assignedTrainings = [];

        if (contentTitles.length > 0) {
            for (const title of contentTitles) {
                const upperTitle = title.trim().toUpperCase();
                if (trainingMap.has(upperTitle)) {
                    assignedTrainings.push(trainingMap.get(upperTitle));
                } else {
                    // Create placeholder training
                    console.log(`Creating placeholder training: ${title}`);
                    const newTraining = await prisma.training.create({
                        data: {
                            title: title,
                            description: 'Eğitim yüklenecektir.',
                            type: 'FILE', // Default for placeholder
                            category: categoryName || 'DIĞER'
                        }
                    });
                    trainingMap.set(upperTitle, newTraining);
                    assignedTrainings.push(newTraining);
                }
            }
        } else {
            // No content specified for this category, create one placeholder with the category name
            const upperTitle = categoryName.trim().toUpperCase();
            if (trainingMap.has(upperTitle)) {
                assignedTrainings.push(trainingMap.get(upperTitle));
            } else {
                console.log(`Creating placeholder training for category: ${categoryName}`);
                const newTraining = await prisma.training.create({
                    data: {
                        title: categoryName,
                        description: 'Eğitim yüklenecektir.',
                        type: 'FILE',
                        category: categoryName
                    }
                });
                trainingMap.set(upperTitle, newTraining);
                assignedTrainings.push(newTraining);
            }
        }
        categoryToTrainings.set(categoryName, assignedTrainings);
    }

    // 4. Process Competency Matrix
    const headers = matrixData[0];
    // Matrix headers: Hat, Personel, 5S..., Bakım...
    // We care about Personel (index 1) and training columns (index 2+)

    let assignedCount = 0;

    for (let i = 1; i < matrixData.length; i++) {
        const row = matrixData[i];
        if (!row || row.length < 2) continue;

        const personnelName = row[1];
        if (!personnelName) continue;

        const user = userMap.get(personnelName.trim().toUpperCase());
        if (!user) {
            console.log(`User not found in DB: ${personnelName}`);
            continue;
        }

        // Check each training column
        for (let j = 2; j < row.length; j++) {
            const cellValue = row[j];
            if (cellValue && cellValue.toString().toUpperCase() === 'X') {
                const categoryName = headers[j];
                const trainings = categoryToTrainings.get(categoryName);

                if (trainings) {
                    for (const training of trainings) {
                        // Assign training to user
                        try {
                            await prisma.trainingProgress.upsert({
                                where: {
                                    user_id_training_id: {
                                        user_id: user.id,
                                        training_id: training.id
                                    }
                                },
                                update: {
                                    is_mandatory: true
                                },
                                create: {
                                    user_id: user.id,
                                    training_id: training.id,
                                    status: 'IN_PROGRESS',
                                    progress_percentage: 0,
                                    is_mandatory: true
                                }
                            });
                            assignedCount++;
                        } catch (err) {
                            console.error(`Error assigning training ${training.title} to ${user.name}:`, err.message);
                        }
                    }
                }
            }
        }
    }

    console.log(`\n--- Import Finished ---`);
    console.log(`Total assignments created/updated: ${assignedCount}`);
}

main()
    .catch(e => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

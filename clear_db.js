const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanUp() {
    console.log('--- VERITABANI TEMIZLIGI BASLATILDI ---');
    
    // Delete all answers first (due to foreign key)
    const answers = await prisma.answer.deleteMany({});
    console.log(`${answers.count} cevap silindi.`);

    // Delete all questions
    const questions = await prisma.question.deleteMany({});
    console.log(`${questions.count} soru silindi.`);

    // Delete exams linked to QUIZ trainings
    const quizTrainings = await prisma.training.findMany({ where: { type: 'QUIZ' } });
    const quizIds = quizTrainings.map(t => t.id);
    
    const exams = await prisma.exam.deleteMany({ where: { training_id: { in: quizIds } } });
    console.log(`${exams.count} quiz sınavı silindi.`);

    // Delete QUIZ trainings
    const trainings = await prisma.training.deleteMany({ where: { type: 'QUIZ' } });
    console.log(`${trainings.count} quiz eğitimi silindi.`);

    console.log('--- TEMIZLIK TAMAMLANDI ---');
}

cleanUp().catch(console.error).finally(() => prisma.$disconnect());

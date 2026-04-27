const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const trainings = await prisma.training.findMany();
    console.log('Total trainings:', trainings.length);
    trainings.forEach(t => console.log(`- ${t.title} (${t.id})`));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

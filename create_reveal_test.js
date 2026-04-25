const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'EMPLOYEE' }
    });

    if (!user) {
        console.log("Kullanıcı bulunamadı.");
        return;
    }

    const training = await prisma.training.create({
        data: {
            title: "✨ Yeni Nesil İnteraktif Eğitim (Reveal.js)",
            description: "Bu eğitim reveal.js altyapısı kullanılarak hazırlanan modern ve etkileşimli bir slayt örneğidir.",
            type: "REVEAL",
            file_url: "internal", // Not used for reveal, content is sample for now
        }
    });

    await prisma.trainingProgress.create({
        data: {
            user_id: user.id,
            training_id: training.id,
            progress_percentage: 0,
            status: 'IN_PROGRESS'
        }
    });

    console.log("Test eğitimi başarıyla oluşturuldu: ", training.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

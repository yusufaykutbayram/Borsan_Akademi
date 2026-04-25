const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Mevcut tüm eğitimleri sil (Cascade sayesinde progress'ler de silinir)
  await prisma.training.deleteMany();
  console.log('Eski eğitimler silindi.');

  // 2. Yeni eğitimi ekle
  const newTraining = await prisma.training.create({
    data: {
      title: 'Borsan Akademi Oryantasyon Eğitimi',
      description: 'Yeni katılan personeller için genel oryantasyon sunumu.',
      type: 'PTX',
      file_url: 'https://sarexqiaokpesnzdybdx.supabase.co/storage/v1/object/sign/egitimler/Borsan%20Akademi%20Oryantasyon%20Egitim%20Foyu.pptx?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80YzE1NzIwOC0zNDVkLTQzMTEtYmVmYy0xNjUxYmVkZDA4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJlZ2l0aW1sZXIvQm9yc2FuIEFrYWRlbWkgT3J5YW50YXN5b24gRWdpdGltIEZveXUucHB0eCIsImlhdCI6MTc3NzEwNzgzNywiZXhwIjoxODA4NjQzODM3fQ.jkLwK6oLYRWAFubE-vZwx7lKQh2aaRJM3hVPWyRNueM'
    }
  });

  // 3. Mevcut çalışanlara bu eğitimi ata
  const users = await prisma.user.findMany({ where: { role: 'EMPLOYEE' } });
  if (users.length > 0) {
    await prisma.trainingProgress.createMany({
      data: users.map(u => ({
        user_id: u.id,
        training_id: newTraining.id,
        status: 'IN_PROGRESS',
        progress_percentage: 0
      }))
    });
    console.log(`${users.length} çalışana yeni eğitim atandı.`);
  }

  console.log('İşlem başarıyla tamamlandı.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

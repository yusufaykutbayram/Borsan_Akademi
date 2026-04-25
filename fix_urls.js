const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const ts = await prisma.training.findMany();
  for (const t of ts) {
    let url = t.file_url.replace(/["']/g, '').trim();
    // Also fix double backslashes if needed, but primarily quotes
    await prisma.training.update({
      where: { id: t.id },
      data: { file_url: url }
    });
    console.log(`Updated: ${t.title} -> ${url}`);
  }
  console.log('DB temizlendi.');
}

fix().catch(console.error).finally(() => prisma.$disconnect());

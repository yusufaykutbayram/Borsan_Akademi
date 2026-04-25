const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { tc_number: '111111' },
    update: { role: 'ADMIN', password_hash: hash },
    create: {
      name: 'Admin Test',
      tc_number: '111111',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  console.log('Admin created: 111111 / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());

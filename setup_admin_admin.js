const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin', 10);
  const user = await prisma.user.upsert({
    where: { tc_number: 'admin' },
    update: { role: 'ADMIN', password_hash: hash },
    create: {
      name: 'Admin',
      tc_number: 'admin',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  console.log('Admin user updated: admin / admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());

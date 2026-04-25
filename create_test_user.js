const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { tc_number: '999999' },
    update: {
      password_hash: hash,
      role: 'EMPLOYEE'
    },
    create: {
      name: 'Test User',
      tc_number: '999999',
      password_hash: hash,
      role: 'EMPLOYEE'
    }
  });
  
  console.log('Test user created/updated:', user.name);
  console.log('Login with: Test User / 123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());

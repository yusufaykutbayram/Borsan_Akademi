const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = 'Admin'; // Let's use 'Admin' as password for simplicity in testing
  const hash = await bcrypt.hash(password, 10);
  
  const updatedUser = await prisma.user.updateMany({
    where: { name: 'Admin' },
    data: { password_hash: hash }
  });
  
  console.log('Admin user(s) updated:', updatedUser.count);
  console.log('New password is: Admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());

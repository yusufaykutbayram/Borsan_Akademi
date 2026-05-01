const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  // Set a clean admin user
  await prisma.user.upsert({
    where: { tc_number: 'admin_test' },
    update: { 
      name: 'Test Admin',
      password_hash: hash,
      role: 'ADMIN'
    },
    create: {
      name: 'Test Admin',
      tc_number: 'admin_test',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  
  console.log('Admin test user created/updated:');
  console.log('Username (TC): admin_test');
  console.log('Password: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());

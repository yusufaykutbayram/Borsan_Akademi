const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin(name, password) {
  console.log(`Testing login for: ${name} with password: ${password}`);
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { tc_number: { equals: name, mode: 'insensitive' } },
        { sicil_no: { equals: name, mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${users.length} matching users.`);
  
  for (const user of users) {
    console.log(`Checking user: ${user.name} (TC: ${user.tc_number}, Sicil: ${user.sicil_no})`);
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log(`Password valid: ${isPasswordValid}`);
  }
}

async function main() {
  await testLogin('admin', 'admin');
  await testLogin('Admin', 'admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());

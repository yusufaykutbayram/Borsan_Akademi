const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin', 10);
  
  // Önce varsa eskiyi silelim veya doğrudan güncelleme yapalım
  const user = await prisma.user.upsert({
    where: { tc_number: 'admin' },
    update: { 
        password_hash: hash,
        role: 'ADMIN',
        name: 'Admin'
    },
    create: {
      name: 'Admin',
      tc_number: 'admin',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  
  console.log('Şifre Başarıyla Sıfırlandı!');
  console.log('TC: admin');
  console.log('Şifre: admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());

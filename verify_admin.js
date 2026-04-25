const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  console.log('=== ADMIN KULLANICILARI ===');
  console.log('Toplam admin sayısı:', users.length);
  
  for (const u of users) {
    console.log('---');
    console.log('Ad:', u.name);
    console.log('TC:', u.tc_number);
    console.log('Rol:', u.role);
    console.log('force_pw_change:', u.force_pw_change);
    
    // Şifre testi
    const test1 = await bcrypt.compare('AdminBorsan2026!', u.password_hash);
    const test2 = await bcrypt.compare('123456', u.password_hash);
    const test3 = await bcrypt.compare('Borsan2026', u.password_hash);
    console.log('AdminBorsan2026! eşleşiyor mu:', test1);
    console.log('123456 eşleşiyor mu:', test2);
    console.log('Borsan2026 eşleşiyor mu:', test3);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

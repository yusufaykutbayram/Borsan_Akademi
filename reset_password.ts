import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = 'Brs123'
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const admin = await prisma.user.upsert({
    where: { tc_number: '111111' },
    update: {
      name: 'Admin',
      password_hash: hashedPassword,
      role: 'ADMIN',
      force_pw_change: false
    },
    create: {
      name: 'Admin',
      tc_number: '111111',
      password_hash: hashedPassword,
      role: 'ADMIN',
      force_pw_change: false,
    },
  })

  console.log('------------------------------------------')
  console.log('Şifre başarıyla sıfırlandı!')
  console.log('Ad Soyad:', admin.name)
  console.log('TC (Kullanıcı Adı):', admin.tc_number)
  console.log('Yeni Şifre:', newPassword)
  console.log('------------------------------------------')
}

main()
  .catch((e) => {
    console.error('Sıfırlama sırasında hata oluştu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

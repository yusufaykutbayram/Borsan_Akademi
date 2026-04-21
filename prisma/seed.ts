import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('123456', 10)
  
  const admin = await prisma.user.upsert({
    where: { tc_number: '111111' },
    update: {},
    create: {
      name: 'Sistem Yöneticisi',
      tc_number: '111111',
      password_hash: adminPassword,
      role: 'ADMIN',
      force_pw_change: false,
    },
  })

  console.log("Seed completed. Admin created:", admin.name, "- TC:", admin.tc_number)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

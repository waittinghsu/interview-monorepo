import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: '測試用戶',
      nickname: 'demo',
      phone: '0909000000',
      email: 'demo@example.com',
      password: hashed,
      level: 1,
      avatarId: 1,
      role: 'member',
      balance: 10000,
      bookmarks: [],
    },
  })

  console.log('Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

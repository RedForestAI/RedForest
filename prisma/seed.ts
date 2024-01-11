import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const s1 = await prisma.profile.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      role: Role.STUDENT
    },
  })
  const s2 = await prisma.profile.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      role: Role.STUDENT
    },
  })
  console.log({ s1, s2 })
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

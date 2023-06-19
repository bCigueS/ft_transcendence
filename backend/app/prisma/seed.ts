import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const simon = await prisma.user.upsert({
    where: { name: 'Simon' },
    update: {},
    create: {
      email: 'sbeylot@student.42.fr',
      name: 'Simon',
      login: 'sbeylot',
      password: 'lolilolilol',
      avatar: 'sbeylot.jpg'
    },
  })
  const fany = await prisma.user.upsert({
    where: { name: 'Faaaany' },
    update: {},
    create: {
      email: 'foctavia@student.42.fr',
      name: 'Faaaany',
      login: 'foctavia',
      password: 'lolilolilol',
      avatar: 'foctavia.jpg'
    },
  })
  const olivia = await prisma.user.upsert({
    where: { name: 'Olivia' },
    update: {},
    create: {
      email: 'owalsh@student.42.fr',
      name: 'Olivia',
      login: 'owalsh',
      password: 'lolilolilol',
      avatar: 'owalsh.jpg'
    },
  })
  const yangchi = await prisma.user.upsert({
    where: { name: 'Yang Chi' },
    update: {},
    create: {
      email: 'ykuo@student.42.fr',
      name: 'Yang Chi',
      login: 'ykuo',
      password: 'lolilolilol',
      avatar: 'ykuo.jpg'
    },
  })
  console.log({ simon, fany, olivia, yangchi })
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
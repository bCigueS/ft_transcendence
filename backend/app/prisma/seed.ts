import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const simon = await prisma.user.upsert({
    where: { name: 'Simon' },
    update: {},
    create: {
      id42: 1,
      email: 'sbeylot@student.42.fr',
      name: 'Simon',
      login: 'sbeylot',
      password: 'lolilolilol',
      avatar: 'sbeylot.jpg',
      token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4sbeylot',
    },
  })
  const fany = await prisma.user.upsert({
    where: { name: 'Faaaany' },
    update: {},
    create: {
      id42: 2,
      email: 'foctavia@student.42.fr',
      name: 'Faaaany',
      login: 'foctavia',
      password: 'lolilolilol',
      avatar: 'foctavia.jpg',
      token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4foctavia',
    },
  })
  const olivia = await prisma.user.upsert({
    where: { name: 'Olivia' },
    update: {},
    create: {
      id42: 3,
      email: 'owalsh@student.42.fr',
      name: 'Olivia',
      login: 'owalsh',
      password: 'lolilolilol',
      avatar: 'owalsh.jpg',
      token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4owalsh',
    },
  })
  const yangchi = await prisma.user.upsert({
    where: { name: 'Yang Chi' },
    update: {},
    create: {
      id42: 4,
      email: 'ykuo@student.42.fr',
      name: 'Yang Chi',
      login: 'ykuo',
      password: 'lolilolilol',
      avatar: 'ykuo.jpg',
      token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4ykuo',
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
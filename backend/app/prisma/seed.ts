
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { name: 'yangchi' },
    update: {},
    create: {
      name: 'yangchi',
      email: 'ykuo@student.42.fr',
	  password: '123',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { name: 'fany' },
    update: {},
    create: {
      name: 'fany',
      email: 'foctavia@student.42.fr',
	  password: '123',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { name: 'simon' },
    update: {},
    create: {
      name: 'simon',
      email: 'sbeylot@student.42.fr',
	  password: '123',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { name: 'olivia' },
    update: {},
    create: {
      name: 'olivia',
      email: 'owalsh@student.42.fr',
	  password: '123',
    },
  });

  console.log({ user1, user2, user3, user4 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
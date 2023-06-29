import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

// User creation
const alex = await prisma.user.upsert({
    where: { name: 'Alex' },
    update: {},
    create: {
      id42: 5,
      email: 'achane-l@student.42.fr',
      name: 'Alex',
      login: 'achane-l',
      password: 'lolilolilol',
      avatar: 'achane-l.jpg',
      token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4achane',
    },
  })
// const simon = await prisma.user.upsert({
//     where: { name: 'Simon' },
//     update: {},
//     create: {
//       id42: 1,
//       email: 'sbeylot@student.42.fr',
//       name: 'Simon',
//       login: 'sbeylot',
//       password: 'lolilolilol',
//       avatar: 'sbeylot.jpg',
//       token: '72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4sbeylot',
//     },
//   })
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
});


// Channel creation
// const channel1 = await prisma.channel.create({
//     data: {
//         name: 'private',
//         creatorId: simon.id,
//     },
// });

// const channel2 = await prisma.channel.create({
//     data: {
//         name: 'private',
//         creatorId: simon.id,
//     },
// });

// ChannelMemberships creation
// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: simon.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel1.id,
//             },
//         },
//     },
// });

// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: alex.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel1.id,
//             },
//         },
//     },
// });
// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: simon.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel2.id,
//             },
//         },
//     },
// });
// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: fany.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel2.id,
//             },
//         },
//     },
// });
// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: simon.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel2.id,
//             },
//         },
//     },
// });
// await prisma.channelMembership.create({
//     data: {
//         user: {
//             connect: {
//                 id: fany.id,
//             },
//         },
//         channel: {
//             connect: {
//                 id: channel2.id,
//             },
//         },
//     },
// });

// Messages creation
// const messages1 = [
//     {
//         createdAt: new Date('2023-06-12T09:16:21.758Z'),
//         content: "Hey girl",
//         senderId: simon.id,
//         channelId: channel1.id,
//     },
// 	{
//         createdAt: new Date('2023-06-12T09:16:26.758Z'),
//         content: "I beg your pardon???",
//         senderId: alex.id,
//         channelId: channel1.id,
//     },
// 	{
//         createdAt: new Date('2023-06-12T09:16:27.758Z'),
//         content: "I am a dominant male",
//         senderId: alex.id,
//         channelId: channel1.id,
//     },

// ];

// for (const messageData of messages1) {
//     await prisma.message.create({
//         data: messageData,
//     });
// }

// const messages2 = [
//     {
//         createdAt: new Date('2023-05-04T11:16:47.835Z'),
//         content: "Euuuuuuh hey?",
//         senderId: fany.id,
//         channelId: channel2.id,
//     }
// ];

// for (const messageData of messages2) {
//     await prisma.message.create({
//         data: messageData,
//     });
// }

 
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
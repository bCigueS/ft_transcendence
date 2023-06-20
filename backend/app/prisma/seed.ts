import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

	async function findOrCreateUser(user: {
		email: string,
		name: string,
		password: string,
		avatar: string,
		doubleAuth?: boolean,
		wins?: number
	}) {
		let foundUser = await prisma.user.findUnique({
			where: {
				name: user.name,
			},
		});
	
		if (!foundUser) {
			foundUser = await prisma.user.create({
				data: user,
			});
		}
	
		return foundUser;
	}

// User creation
const simon = await findOrCreateUser({
    email: 'sbeylot@student.42.fr',
    name: 'Simon',
	password: 'lolilolilolilol',
    avatar: 'sbeylot.jpg',
    doubleAuth: false,
    wins: 0,
});

const alex = await findOrCreateUser({
    email: 'achane-l@student.42.fr',
    name: 'Alex',
	password: 'lolilolilolilol',
    avatar: 'achane-l.jpg',
    doubleAuth: false,
    wins: 0,
});

const fany = await findOrCreateUser({
    email: 'foctavia@student.42.fr',
    name: 'Faaaany',
	password: 'lolilolilolilol',
    avatar: 'foctavia.jpg',
    doubleAuth: false,
    wins: 0,
});

const yangchi = await findOrCreateUser({
    email: 'ykuo@student.42.fr',
    name: 'Yang Chi',
	password: 'lolilolilolilol',
    avatar: 'ykuo.jpg',
    doubleAuth: false,
    wins: 0,
});

const olivia = await findOrCreateUser({
    email: 'owalsh@student.42.fr',
    name: 'Olivia',
	password: 'lolilolilolilol',
    avatar: 'owalsh.jpg',
    doubleAuth: false,
    wins: 0,
});


// Channel creation
const channel1 = await prisma.channel.create({
    data: {
        name: 'private',
        creatorId: simon.id,
    },
});

const channel2 = await prisma.channel.create({
    data: {
        name: 'private',
        creatorId: simon.id,
    },
});

// ChannelMemberships creation
await prisma.channelMembership.create({
    data: {
        user: {
            connect: {
                id: simon.id,
            },
        },
        channel: {
            connect: {
                id: channel1.id,
            },
        },
    },
});

await prisma.channelMembership.create({
    data: {
        user: {
            connect: {
                id: alex.id,
            },
        },
        channel: {
            connect: {
                id: channel1.id,
            },
        },
    },
});
await prisma.channelMembership.create({
    data: {
        user: {
            connect: {
                id: simon.id,
            },
        },
        channel: {
            connect: {
                id: channel2.id,
            },
        },
    },
});
await prisma.channelMembership.create({
    data: {
        user: {
            connect: {
                id: fany.id,
            },
        },
        channel: {
            connect: {
                id: channel2.id,
            },
        },
    },
});

// Messages creation
const messages1 = [
    {
        createdAt: new Date('2023-06-12T09:16:21.758Z'),
        content: "Hey girl",
        senderId: simon.id,
        channelId: channel1.id,
    },
	{
        createdAt: new Date('2023-06-12T09:16:26.758Z'),
        content: "I beg your pardon???",
        senderId: alex.id,
        channelId: channel1.id,
    },
	{
        createdAt: new Date('2023-06-12T09:16:27.758Z'),
        content: "I am a dominant male",
        senderId: alex.id,
        channelId: channel1.id,
    },

];

for (const messageData of messages1) {
    await prisma.message.create({
        data: messageData,
    });
}

const messages2 = [
    {
        createdAt: new Date('2023-05-04T11:16:47.835Z'),
        content: "Euuuuuuh hey?",
        senderId: fany.id,
        channelId: channel2.id,
    }
];

for (const messageData of messages2) {
    await prisma.message.create({
        data: messageData,
    });
}

 
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
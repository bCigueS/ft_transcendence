import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelMembershipDto, CreateMessageDto } from 'src/messages/dto/create-message.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChannelDto: CreateChannelDto) {
    const { name, messages, members } = createChannelDto;

    if (members.length < 2) {
      throw new Error("Invalid channel creation request: must include at least two members.");
    }

    const channel = await this.prisma.channel.create({ 
      data: { name },
    });

    if (messages && messages.length > 0)
    {
      for (const msg of messages) {
        const messageDto: CreateMessageDto = { 
          content: msg.content, 
          senderId: msg.senderId,
          channelId: channel.id
        };
    
        await this.prisma.message.create({
          data: {
            ...messageDto,
          },
        });
      }
    }
      
    for (const member of members) {
      const memberDto: CreateChannelMembershipDto = { userId: member.userId };
      await this.prisma.channelMembership.create({
        data: {
          ...memberDto,
          channelId: channel.id,
        },
      });
    }

    return channel;
  }

  async findAll() {
    return await this.prisma.channel.findMany({
      include: {
        messages: true,
        members: true,
      }
    });
  }

  async findOne(id: number) {

    const chan = await this.prisma.channel.findUnique({
      where: { 
        id
      },
      include: {
        messages: true,
        members: true,
      }    
    });

    return chan;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {

    const { name, messages, members } = updateChannelDto;

    const channel = await this.findOne(id); 

    if (name)
    {
      await this.prisma.channel.update({
        where: { id },
        data: {
          name: name
        }
      });
    }

    if (messages)
    {

      for (const msg of messages) {
        const messageDto: CreateMessageDto = { 
          content: msg.content, 
          senderId: msg.senderId,
		  channelId: channel.id
        };
        await this.prisma.message.create({
          data: {
            ...messageDto,
            channelId: channel.id,
          },
        });
      }
    }

    if (members) {
      for (const member of members) {
        const memberDto: CreateChannelMembershipDto = { userId: member.userId };
        await this.prisma.channelMembership.create({
          data: {
            ...memberDto,
            channelId: channel.id,
          },
        });
      }
    }
      
    return channel;
  }

  async remove(id: number) {

    const deletedChannel = await this.prisma.channel.delete({ where: { id }})
    return this.findAll();
  }

  async findUserChannels(id: number) {

	const userChannels = await this.prisma.channel.findMany({
		where: {
			members: {
			  some: {
				userId: id,
			  },
			},
		  },
		  include: {
			members: {
			  select: {
				user: {
				  select: {
					id: true,
					email: true,
					name: true,
					avatar: true,
					doubleAuth: true,
					wins: true,
				  }
				}
			  }
			},
			messages: true,
		  },
		});

	const reformattedChannels = userChannels.map(channel => {
		return {
		...channel,
		members: channel.members.map(member => member.user)
		}
	});
	
	return reformattedChannels;
  }
}

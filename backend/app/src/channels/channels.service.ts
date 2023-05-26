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

    for (const msg of messages) {
      const messageDto: CreateMessageDto = { 
        content: msg.content, 
        senderId: msg.senderId
      };

      console.log("message content: ", messageDto.content);
      console.log("message senderId: ", messageDto.senderId);
      await this.prisma.message.create({
        data: {
          ...messageDto,
          channelId: channel.id,
        },
      });
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
    return await this.prisma.channel.findMany();
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
          senderId: msg.senderId
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
    return `This action updates a #${id} channel`;
  }

  async remove(id: number) {

    const deletedChannel = await this.prisma.channel.delete({ where: { id }})
    return this.findAll();
  }
}

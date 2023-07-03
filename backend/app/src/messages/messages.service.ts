import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, CreateChannelMembershipDto } from 'src/channels/dto/create-channel.dto';

@Injectable()
export class MessagesService {
	constructor(private prisma: PrismaService) { }
	
	async create(createMessageDto: CreateMessageDto) {
		if (!createMessageDto.senderId || !createMessageDto.content || !createMessageDto.channelId) {
			throw new BadRequestException('Invalid message data');
		}
		
		const newMessage = await this.prisma.message.create({ 
			data: {
				senderId: createMessageDto.senderId,
				content: createMessageDto.content,
				channelId: createMessageDto.channelId,
		  	},
		});

		return newMessage;
	}

	async findAll () {
		return await this.prisma.message.findMany();
	}

	findOne(id: number) {
		return `This action returns a #${id} message`;
	}

	update(id: number, updateMessageDto: UpdateMessageDto) {
		return `This action updates a #${id} message`;
	}

	async remove(id: number) {
		return await this.prisma.message.delete({ where: { id } });
	}
}
function sanitize(content: string) {
	throw new Error('Function not implemented.');
}


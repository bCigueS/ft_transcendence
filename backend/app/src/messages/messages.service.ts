import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
	constructor(private prisma: PrismaService) { }
	
	async create(createMessageDto: CreateMessageDto) {

		const newMessage = await this.prisma.message.create({ 
			data: {
				...createMessageDto,
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

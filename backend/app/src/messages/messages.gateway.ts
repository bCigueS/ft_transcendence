import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageEntity } from './entities/message.entity';

@WebSocketGateway({ namespace: '/chat', cors: '*' })
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly messagesService: MessagesService, private prisma: PrismaService) {}

  @WebSocketServer() io: Namespace;
  @WebSocketServer() server: Server

  afterInit(): void {
    this.logger.log(`Websocket chat gateway initialized.`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: { 
				content: string,
				channelId: number,
				senderId: number }): Promise<void> {

	console.log('message: ', message);

	const newMessage = await this.prisma.message.create({
		data: {
			senderId: message.senderId,
			content: message.content,
			channelId: message.channelId
		}
	});

	

	this.server.emit('message', message);
  }
  
  async handleConnection(client: Socket) {
	client.on('send', ({ content }: {content: string}) => {
		console.log('text: ', content);

		this.server.emit('chat', content);
		
	})
  }


}

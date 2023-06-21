import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageEntity } from './entities/message.entity';
import { GamesGateway } from '../games/games.gateway';

@WebSocketGateway({ namespace: '/chat', cors: '*' })
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly messagesService: MessagesService, private prisma: PrismaService) {}

  @WebSocketServer() io: Namespace;
  @WebSocketServer() server: Server

  afterInit(): void {
    this.logger.log(`Websocket chat gateway initialized.`);

	GamesGateway.eventEmitter.on('gameInvitation', async ({ senderId, receiverId, gameRoom }) => {
		const sender = await this.prisma.user.findUnique({ where: { id: senderId } });

		// prisma.channels.findMany where name = "private" with members are sender and receiver
		// if exist, get channelId and you have it
		// else, create channel 
			// name: "private",
			// members: [sender, receiver]
			// creatorId: senderId
			// get  CHANNEL ID AFTER CREATED
		// 

		if (!sender) {
			throw new NotFoundException(`User with ${senderId} does not exist.`);
		}
		
		this.handleMessage(receiverId, {
		content: `${sender.name} has invited you to a game!`,
		channelId: gameRoom,
		senderId: senderId,
	  });
	});
  }


  @SubscribeMessage('join')
  async handleJoin(client: Socket, channelId: number) {

	console.log('client joined channel ', channelId);
	client.join(channelId.toString());

  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: { 
				content: string,
				channelId: number,
				senderId: number }): Promise<void> {

	console.log('in message gateway, message: ', message);


	const newMessage = await this.prisma.message.create({
		data: {
			senderId: message.senderId,
			content: message.content,
			channelId: message.channelId
		}
	});

	// this.server.emit('message', newMessage);
	// client.emit('message', newMessage);

	console.log('sending message: ', message.content, ' to all clients in room ', message.channelId);
	this.io.in(message.channelId.toString()).emit('message', newMessage);

}
  
  async handleConnection(client: Socket) {
	client.on('send', ({ content }: {content: string}) => {
		console.log('text: ', content);

		this.server.emit('chat', content);
		
	})
  }


}

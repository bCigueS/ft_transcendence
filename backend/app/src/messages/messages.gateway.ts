import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
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

  private onlineUsers: { [userId: number]: string } = {};

  afterInit(): void {
    this.logger.log(`Websocket chat gateway initialized.`);
  }

  async handleConnection(client: Socket) {

    client.on('user_connected', (userId) => {
      this.onlineUsers[userId] = client.id;
      console.log('User connected: ', userId);
    });

    client.on('disconnect', () => {
      const userToDisconnect = Object.keys(this.onlineUsers).find(key => this.onlineUsers[key] === client.id);
      if (userToDisconnect) {
        delete this.onlineUsers[userToDisconnect];
        console.log('User disconnected: ', userToDisconnect);
      }
    });
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, channelId: number) {
	client.join(channelId.toString());
	// const receiverSocketId = this.onlineUsers[receiver.userId];
	// this.io.to(channelId.toString()).emit('userJoined', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: { 
				content: string,
				channelId: number,
				senderId: number }): Promise<void> {
	const chan = await this.prisma.channel.findUnique({
		where: {id: message.channelId}
	});

	if (!chan)
		return ;
	
	const existingMessages = await this.prisma.message.findMany({
		where: {
			channelId: message.channelId
		}
	});

	const isFirstMessage = existingMessages.length === 0;

	const newMessage = await this.prisma.message.create({
		data: {
			senderId: message.senderId,
			content: message.content,
			channelId: message.channelId
		}
	});

	if (isFirstMessage) {
		console.log('this is the first message ever in this convo.');
		const channelMembers = await this.prisma.channelMembership.findMany({
			where: {
				channelId: message.channelId
			}
		});

		const receiver = channelMembers.find(member => member.userId !== message.senderId);
		console.log('receive is: ', receiver.userId);

		if (receiver) {
			const receiverSocketId = this.onlineUsers[receiver.userId];
			console.log('emitting join to user ', receiver.userId.toString());
			this.io.to(receiverSocketId).emit('join', message.channelId.toString());
		}
	}

	console.log('sending message: ', message.content, ' to all clients in room ', message.channelId);
	this.io.in(message.channelId.toString()).emit('message', newMessage);

	}

	@SubscribeMessage('createJoin')
		async makeInstantJoin(@ConnectedSocket() client: Socket, 
		@MessageBody() data: { 
			receiverId: number, 
			channelId: number}) {
		const receiverSocketId = this.onlineUsers[data.receiverId];
		console.log('emitting join to user ', data.receiverId.toString());
		this.io.to(receiverSocketId).emit('join', data.channelId.toString());
	}
  
	@SubscribeMessage('chatDeleted')
	async handleChatDeletion(@ConnectedSocket() client: Socket, 
							@MessageBody() data: { 
								chatId: number, 
								userId: number
							}): Promise<void> {
	  client.broadcast.emit('chatDeleted', data);
	}

	@SubscribeMessage('kickUser')
	async handleKickUser(@ConnectedSocket() client: Socket, 
							@MessageBody() data: { 
								channelId: number, 
								userId: number
							}): Promise<void> {
		console.log('in message gateway, received kickUser of user ', data.userId, 'from channel: ', data.channelId);
		const kickedSocketId = this.onlineUsers[data.userId];
		this.io.to(kickedSocketId).emit('handleKick', data.channelId.toString());
			// client.broadcast.emit('chatDeleted', data);
	}

	@SubscribeMessage('handleJoinGroup')
	async handleJoinGroup(@ConnectedSocket() client: Socket, @MessageBody() data: { channelId: number, userId: number }): Promise<void> {
		console.log('In message gateway, user ', data.userId, ' just joined:', data.channelId);

		const channel = await this.prisma.channel.findUnique({
			where: { id: data.channelId },
			include: { members: true },
		});

		if (!channel) {
			return;
		}

		const returnedData = {
			channelId: data.channelId,
			updatedMembers: channel.members, 
		}

		this.io.to(data.channelId.toString()).emit('userJoined', returnedData);
	}

	@SubscribeMessage('messageDeleted')
	async handleMessageDeletion(@ConnectedSocket() client: Socket, 
							@MessageBody() data: { 
								message: {
									id: number,
									createdAt: string,
									content: string,
									channelId: number,
									senderId: number }, 
								userId: number
							}): Promise<void> {
		console.log(' in message gateway, about to delete message: ', data.message.content);
		this.io.in(data.message.channelId.toString()).emit('messageDeleted', data.message);
	// client.broadcast.emit('messageDeleted', data.message);
	}

}


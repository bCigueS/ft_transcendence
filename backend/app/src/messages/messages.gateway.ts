import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageEntity } from './entities/message.entity';

@WebSocketGateway({ namespace: '/chat' })
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly messagesService: MessagesService, private prisma: PrismaService) {}

  @WebSocketServer() io: Namespace;
  @WebSocketServer() server: Server

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket chat gateway initialized.`);
  }

  async handleConnection(client: Socket) {
	client.on('send', ({ content }: {content: string}) => {
		console.log('text: ', content);
		
		// create message and send the channel id
	})
  }


}

import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { ChannelsService } from 'src/channels/channels.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, ChannelsService],
})
export class MessagesModule {}

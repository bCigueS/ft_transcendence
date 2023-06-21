import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [MessagesModule],

})
export class ChannelsModule {}

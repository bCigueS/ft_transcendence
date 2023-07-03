import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { ChannelsService } from 'src/channels/channels.service';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, ChannelsService],
})
// export class MessagesModule {}

export class MessagesModule implements NestMiddleware
{
  use(req: any, res: any, next: (error?: any) => void)
  {
    throw new Error('Method not implemented.');
  }
  configure(consumer: MiddlewareConsumer)
  {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(MessagesController);
  }
}

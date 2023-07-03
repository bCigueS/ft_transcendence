import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [MessagesModule],

})
// export class ChannelsModule {}

export class ChannelsModule implements NestMiddleware
{
  use(req: any, res: any, next: (error?: any) => void)
  {
    throw new Error('Method not implemented.');
  }
  configure(consumer: MiddlewareConsumer)
  {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(ChannelsController);
  }
}


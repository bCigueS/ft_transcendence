import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LiveGamesGateway } from './liveGames.gateway';
import { UsersService } from 'src/users/users.service';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  	controllers: [GamesController],
	providers: [GamesService, UsersService, GamesGateway, LiveGamesGateway],
	imports: [PrismaModule],
})

export class GamesModule implements NestMiddleware
{
  use(req: any, res: any, next: (error?: any) => void)
  {
    throw new Error('Method not implemented.');
  }
  configure(consumer: MiddlewareConsumer)
  {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(GamesController);
  }
}


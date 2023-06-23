import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LiveGamesGateway } from './liveGames.gateway';
import { UsersService } from 'src/users/users.service';

@Module({
  	controllers: [GamesController],
	providers: [GamesService, UsersService, GamesGateway, LiveGamesGateway],
	imports: [PrismaModule],
})
export class GamesModule {}

import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';

@Module({
  	controllers: [GamesController],
	providers: [GamesService, GamesGateway],
})
export class GamesModule {}

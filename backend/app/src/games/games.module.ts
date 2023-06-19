import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  	controllers: [GamesController],
	providers: [GamesService, GamesGateway],
	imports: [PrismaModule],
})
export class GamesModule {}

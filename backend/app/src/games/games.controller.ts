import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameEntity } from './entities/game.entity';
import { Game, GameState, UserGame } from '@prisma/client';

@Controller('games') @ApiTags('game')
export class GamesController {
  constructor(private readonly gamesService: GamesService, private prisma: PrismaService) {}

  @Post()
	@ApiCreatedResponse({ type: GameEntity })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
	@ApiOkResponse({ type: GameEntity, isArray: true })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: GameEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    
    const game = await this.gamesService.findOne(id);
		if (!game)
			throw new NotFoundException(`Game with ${id} does not exist.`);

    return this.gamesService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOkResponse({ type: GameEntity })
  // update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
  //   return this.gamesService.update(id, updateGameDto);
  // }

  @Get('/liveGames')
  @ApiOkResponse({ type: GameEntity, isArray: true })
  async getLiveGame() {
	console.log('in getLiveGame');

	  const games = await this.gamesService.getLiveGame();
	  if (!games)
		  throw new NotFoundException(`Currently there is not any game live.`);
	  
	  return games;
  }

  @Delete(':id')
  @ApiOkResponse({ type: GameEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameState, Prisma } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) { }

  /* CRUD */
  async create(createGameDto: CreateGameDto) {
    const { state, level, players, playerSocketIds, spectatorSocketIds } = createGameDto;

    const newGame = await this.prisma.game.create({
        data: {
			state,
            level,
            players: {
                create: players.map(player => ({
                    userId: player.userId
                }))
            },
			playerSocketIds,
			spectatorSocketIds,
		}
	});

	return newGame;
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
	const { state, players, playerSocketIds, spectatorSocketIds } = updateGameDto;

	const updatedGame = await this.prisma.game.update({
	  where: { id },
	  data: {
		state,
		players: {
			create: players.map(player => ({
				userId: player.userId
			}))
		},
		playerSocketIds,
		spectatorSocketIds,
	  },
	});

	return updatedGame;
  }

// async update(id: number, updateGameDto: UpdateGameDto) {

// 	const updatedGame = await this.prisma.game.update({
// 	  where: { id },
// 	  data: updateGameDto,
// 	});

// 	return updatedGame;
//   }

  async findAll() {
    const games = await this.prisma.game.findMany();

    return games;
  }

  async findOne(id: number) {
    
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game)
      throw new NotFoundException(`Game with ${id} does not exist.`);

    return game;
  }

	// async update(id: number, updateGameDto: UpdateGameDto) {
	// 	const updatedGame = await this.prisma.game.update({
	// 	where: { id },
	// 	...updateGameDto,
	// 	});
	
	// 	return updatedGame;
	// }
	
	
  async remove(id: number) {
		
		const deletedGame = await this.findOne(id);
		
		await this.prisma.game.delete({ where: { id } });
		return this.findAll();
  }

  async addPlayer(id: number, updateGameDto: UpdateGameDto) {
	const { state, players, playerSocketIds } = updateGameDto;

	const updatedGame = await this.prisma.game.update({
	  where: { id },
	  data: {
		state,
		players: {
			create: players.map(player => ({
				userId: player.userId
			}))
		},
		playerSocketIds,
	  },
	});

	return updatedGame;
  }

  async updateSpectatorSocketId(id: number, updateGameDto: UpdateGameDto) {
	const { spectatorSocketIds } = updateGameDto;

	const updatedGame = await this.prisma.game.update({
	  where: { id },
	  data: { spectatorSocketIds: spectatorSocketIds, },
	});

	return updatedGame;
  }
	
  async assignRoom(id: number, room: string) {
	  const updatedGame = await this.prisma.game.update({
		  where: { id },
		  data: { room: room },
		});
	
		return updatedGame;
  }

  async gameOver(id: number, state: GameState) {
	const updatedGame = await this.prisma.game.update({
		where: { id },
		data: { state: state },
	});

	return updatedGame;
  }

  async assignWinner(id: number, winnerId: number) {
	const updatedGame = await this.prisma.game.update({
		where: { id },
		data: { winnerId: winnerId },
	  });
  
	  return updatedGame;
  }

  async getLiveGame() {
	console.log('in getLiveGame');
	const games = await this.prisma.game.findMany({
		where: {
			state: GameState.PLAYING
		},
		include: {
			players: true,
		},
	});

	console.log('in getLiveGame');

	return games;
  }


}

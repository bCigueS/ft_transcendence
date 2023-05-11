import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) { }

  /* CRUD */
  async create(data: CreateGameDto) {

    const { type, level, players, winnerId } = data;

    return this.prisma.game.create({
        data: {
            type,
            level,
            winnerId,
            players: {
                create: players.map(player => ({
                    userId: player.userId,
                    playerIndex: player.playerIndex
                }))
            }
        }
    });

  }

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
    
  //   const updatedGame = await this.prisma.game.update({
  //     where: { id },
  //     data: updateGameDto,
  //   });

  //   return updatedGame;
  // }

  async remove(id: number) {

    const deletedGame = await this.findOne(id);
    
    await this.prisma.game.delete({ where: { id } });
    return this.findAll();
  }

}

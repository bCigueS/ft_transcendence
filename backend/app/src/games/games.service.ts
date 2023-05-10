import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) { }

  /* CRUD */
  async create(data: CreateGameDto) {

    const newGame = await this.prisma.game.create({
      data
    });
    
    return newGame;
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

  async update(id: number, updateGameDto: UpdateGameDto) {
    
    const updatedGame = await this.prisma.game.update({
      where: { id },
      data: updateGameDto,
    });

    return updatedGame;
  }

  async remove(id: number) {

    const deletedGame = await this.findOne(id);
    
    await this.prisma.game.delete({ where: { id } });
    return this.findAll();
  }

  async play(userId: number)
  {
    const pendingGames = await this.prisma.game.findMany({
      where:
      {
        state: "PENDING"
      }
    })

    if (!pendingGames)
    {
      // create a new game with state to pending
      // create a UserGame with current user and assign it to this game

    }
    else
    {
      // get the pendingGame that has the latest createdAt date
      // create a userGame with current user and assign it to this game
      // set game s state to playing
    }

  }

  /* set score, if one player gets highest score set winner and set state to finished */
  // async increasePlayerScore(id: number)
  // {
  //   const game = await this.prisma.game.findUnique({ where: { id } });


  // }

}

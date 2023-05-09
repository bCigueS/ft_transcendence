import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) { }

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
    const deletedGame = await this.prisma.game.delete({ where: { id } });

    return this.findAll();
  }

  
}

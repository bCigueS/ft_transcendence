import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserEntity } from '.prisma/client';
import { Friendship } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserDto) {

    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { 
        id 
      },
      include: {
        friends: true,
        followers: true
      }    
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async addFriend(id: number, friendId: number) {

    if (id === friendId) {
      throw new BadRequestException('A user cannot be friends with themselves.');
    }
  
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const friend = await this.prisma.user.findUnique({ where: { id: friendId } });
   
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        MyId: id,
        friendId: friendId,
      },
    });
  
    if (existingFriendship) {
      throw new BadRequestException('Friendship already exists.');
    }

    const friendship = await this.prisma.friendship.create({
      data: {
        friendId: friend.id,
        MyId : user.id,
      },
      include: {
        friends: true,
        // followers: true
      }
    });

    return friendship.friends;

  }

  async removeFriend(id: number, friendId: number) {

  
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const friend = await this.prisma.user.findUnique({ where: { id: friendId } });
   
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        MyId: id,
        friendId: friendId,
      },
    });
  
    if (!existingFriendship) {
      throw new BadRequestException('Cannot remove user from friend list since its not your friend.');
    }

    await this.prisma.friendship.delete({
        where: {
          id: existingFriendship.id,
        },
    });

    return this.showFriends(id);

  }

  async showFriends(id: number) {
  
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    const existingFriendships = await this.prisma.friendship.findMany({
      where: {
        MyId: id,
      },
      include: {
        friends: true,
        // followers: true,
      },
    });

    const friendsList = existingFriendships.map((friendship) => friendship.friends);

    return existingFriendships;
  }


}

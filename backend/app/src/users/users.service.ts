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

  async blockUser(id: number, blockId: number) {

    if (id === blockId) {
      throw new BadRequestException('A user cannot block itself.');
    }
  
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const toBlock = await this.prisma.user.findUnique({ where: { id: blockId } });
   
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        MyId: id,
        friendId: blockId,
      },
    });
  
    if (existingFriendship) {
      this.removeFriend(id, blockId);
    }

    const block = await this.prisma.block.create({
      data: {
        blockedId: toBlock.id,
        MyId : user.id,
      },
      include: {
        blocked: true,
        // followers: true
      }
    });

    return block.blocked;

  }

  async unblockUser(id: number, blockedId: number) {
  
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    const friend = await this.prisma.user.findUnique({ where: { id: blockedId } });
   
    const existingBlocking = await this.prisma.block.findFirst({
      where: {
        MyId: id,
        blockedId: blockedId,
      },
    });
  
    if (!existingBlocking) {
      throw new BadRequestException('Cannot unblock user who has not been blocked.');
    }

    await this.prisma.block.delete({
        where: {
          id: existingBlocking.id,
        },
    });

    return this.showBlockedUsers(id);

  }

  async showBlockedUsers(id: number) {
  
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    const blockings = await this.prisma.block.findMany({
      where: {
        MyId: id,
      },
      include: {
        blocked: true,
        // haters: true,
      },
    });

    const blockedUsers = blockings.map((block) => block.blocked);

    return blockedUsers;
  }

  async showCommunity(id: number) {
  
    const user = await this.prisma.user.findMany({ 
      where: { id: id }
    });

    const blocked = await this.showBlockedUsers(id);

    const blockedUserIds = blocked.map((block) => block.id);

    const community = await this.prisma.user.findMany({
      where: {
        id: { notIn: blockedUserIds.concat(id) },
      },
    });
    
    return community;
  }

  async updateAvatar(id: number, avatarPath: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
  
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist.`);
    }
  
    console.log(avatarPath);
    
    return this.prisma.user.update({
      where: { id: id },
      data: { avatar: avatarPath },
    });
  }

}

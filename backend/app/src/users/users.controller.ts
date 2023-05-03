import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFriendDto } from './dto/add-friend.dto';

@Controller('users') @ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private prisma: PrismaService) {}

	@Post()
	@ApiCreatedResponse({ type: UserEntity })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity, isArray: true })
	findAll() {
    	return this.usersService.findAll();
  }

	@Get(':id')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return user;	
  }
  
	@Patch(':id')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return this.usersService.findOne(id);
	}
	
	@Delete(':id')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	remove(@Param('id', ParseIntPipe) id: number) {
    	return this.usersService.remove(id);
	}

	@Patch(':id/add-friend')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async addFriend(@Param('id', ParseIntPipe) id: number, @Body() addFriendDto: AddFriendDto) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		const friendId = addFriendDto.friendId;
		const friend = await this.usersService.findOne(friendId);
		if (!friend)
			throw new NotFoundException(`Friend with ${friendId} does not exist.`);

		return this.usersService.addFriend(id, friendId);
	}

	@Patch(':id/remove-friend')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async removeFriend(@Param('id', ParseIntPipe) id: number, @Body() addFriendDto: AddFriendDto) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		const friendId = addFriendDto.friendId;
		const friend = await this.usersService.findOne(friendId);
		if (!friend)
			throw new NotFoundException(`Friend with ${friendId} does not exist.`);

		return this.usersService.removeFriend(id, friendId);
	}

	@Get(':id/show-friends')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async showFriends(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		return this.usersService.showFriends(id);
	}

}

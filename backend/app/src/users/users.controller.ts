import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards, UseInterceptors, UploadedFile, Res, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { BlockingDto } from './dto/blocking.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'
import { toSafeUser } from './user.utils';
import { Observable } from 'rxjs';
import { fileURLToPath } from 'url';
import { unlink } from 'fs';
import { GameEntity } from 'src/games/entities/game.entity';
import { IsNumber, isNumber } from 'class-validator';

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
		
		return this.usersService.update(id, updateUserDto);
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

	@Patch(':id/block-user')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async blockUser(@Param('id', ParseIntPipe) id: number, @Body() blockingDto: BlockingDto) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		const blockedId = blockingDto.blockedId;
		const toBlock = await this.usersService.findOne(blockedId);
		if (!toBlock)
			throw new NotFoundException(`User with ${blockedId} does not exist.`);

		return this.usersService.blockUser(id, blockedId);
	}

	@Patch(':id/unblock-user')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async unblockUser(@Param('id', ParseIntPipe) id: number, @Body() blockingDto: BlockingDto) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		const blockedId = blockingDto.blockedId;
		const toUnblock = await this.usersService.findOne(blockedId);
		if (!toUnblock)
			throw new NotFoundException(`User with ${blockedId} does not exist.`);

		return this.usersService.unblockUser(id, blockedId);
	}

	@Get(':id/show-blocked-users')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async seeBlockedUsers(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		return this.usersService.showBlockedUsers(id);
	}

	@Get(':id/show-haters')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async seeHaters(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		return this.usersService.showHaters(id);
	}

	@Get(':id/show-community')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiOkResponse({ type: UserEntity })
	async showCommunity(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);

		return this.usersService.showCommunity(id);
	}

	@Post(':id/upload-avatar')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: /(jpg|jpeg|png)$/,
				})
				.addMaxSizeValidator({
					maxSize: 1000000
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
			}),
		) file: Express.Multer.File) {
		console.log("This is the file: ", file);

		const validExtension = ['jpg', 'png', 'jpeg'];
		const fileExtension = file.originalname.split('.').pop().toLowerCase();

		console.log(validExtension);
		console.log(fileExtension);

		if (!validExtension.includes(fileExtension)) {
			await unlink(file.path, (err) => {
				if (err) throw err;
				console.error(`${file.filename} delete`)
			});
		}

		// const avatarPath = './uploads/' + file.filename;
		const avatarPath = file.filename;

		this.usersService.uploadAvatar(id, avatarPath);

		return { message: 'Avatar uploaded successfully'};
	}

	@Get(':id/avatar')
	async seeUploadedFile(
		@Param('id', ParseIntPipe) id: number,
		@Res() res) {
		
		const user = await this.usersService.findOne(id);
		return res.sendFile(user.avatar, { root: './uploads'});
	}

	@Get(':id/games')
    @ApiOkResponse({ type: GameEntity, isArray: true })
    async seeUserGames(
        @Param('id', ParseIntPipe) id: number) {

        const games = await this.usersService.seeUserGames(id);
        if (!games)
            throw new NotFoundException(`User with ${id} does not have any game.`);
        
        return games;
    }

	@Get(':id/getMatches')
    @ApiOkResponse({ type: isNumber })
    async getMatches(
        @Param('id', ParseIntPipe) id: number) {

		const games = await this.usersService.seeUserGames(id);
		if (!games || games.length === 0)
			throw new NotFoundException(`User with ID ${id} does not have any games.`);
		
		const totalMatches = games.length;
		return totalMatches;
    }

	@Get(':id/getWins')
    @ApiOkResponse({ type: IsNumber })
    async getWins(
        @Param('id', ParseIntPipe) id: number) {

        const wins = await this.usersService.getWins(id);
        
        return wins;
    }
	
}

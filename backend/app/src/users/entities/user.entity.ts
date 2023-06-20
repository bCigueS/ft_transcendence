import { Block, Friendship, User } from '@prisma/client';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
	@ApiProperty()
	id: number;

	@ApiProperty()
	id42: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	login: string;

	@ApiProperty()
	email: string;

	@ApiHideProperty()
	password: string;

	@ApiProperty()
	avatar: string;

	@ApiProperty()
	doubleAuth: boolean;

	@ApiProperty()
	wins: number;

	@ApiProperty()
	secert: string;

	@ApiProperty()
	status: number;

	@ApiProperty()
	token: string;

	// @ApiProperty({ required: false })
	// friends?: Friendship[];

	// @ApiProperty({ required: false })
	// blocked?: Block[];
	
}

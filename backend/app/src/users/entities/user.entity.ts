import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ required: false })
	avatar: string;

	@ApiProperty({ required: false })
	friends: User[]

	@ApiProperty({ required: false })
	blocked: User[]
	
}

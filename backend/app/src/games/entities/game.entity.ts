import { Game } from '@prisma/client';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class GameEntity implements Game {

    @ApiProperty()
	id: number;

    @ApiProperty()
	createdAt: Date;

	@ApiProperty()
	type: number;

	@ApiProperty()
	winner: UserEntity;

}

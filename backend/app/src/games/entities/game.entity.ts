import { Game, GameState } from '@prisma/client';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class GameEntity implements Game {

    @ApiProperty()
	id: number;

    @ApiProperty()
	createdAt: Date;

	@ApiProperty()
	state: GameState;

	@ApiProperty()
	level: number;

	@ApiProperty()
	winnerId: number;

	@ApiProperty()
	winner: UserEntity;

	@ApiProperty()
	duration: number;

}

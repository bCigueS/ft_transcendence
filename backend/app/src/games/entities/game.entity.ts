import { Game, GameType, GameState } from '@prisma/client';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class GameEntity implements Game {

    @ApiProperty()
	id: number;

    @ApiProperty()
	createdAt: Date;

	@ApiProperty()
	type: GameType;

	@ApiProperty()
	level: number;

	@ApiProperty()
	state: GameState;

	@ApiProperty()
	winnerId: number;

	@ApiProperty()
	winner: UserEntity;

	@ApiProperty()
	duration: number;

}

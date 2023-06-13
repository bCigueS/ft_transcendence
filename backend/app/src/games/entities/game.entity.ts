import { Game, GameState, UserGame } from '@prisma/client';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class GameEntity implements Game {

    @ApiProperty()
	id: number;

	@ApiProperty()
	room: string;

    @ApiProperty()
	createdAt: Date;

	@ApiProperty()
	state: GameState;

	@ApiProperty()
	level: number;

	@ApiProperty()
	players: UserGame[];

	@ApiProperty()
	socketIds: string[];

	@ApiProperty()
	winnerId: number;

	@ApiProperty()
	winner: UserEntity;
}

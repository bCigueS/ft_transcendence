import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { IsInt } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
	// @IsInt()
	// @ApiProperty({ required: false })
	// winnerId?: number | undefined;
}

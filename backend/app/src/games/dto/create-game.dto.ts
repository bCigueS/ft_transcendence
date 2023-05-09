import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { GameType, GameState } from '@prisma/client';

export class CreateGameDto {
   
	@IsNotEmpty()
    @ApiProperty()
    type: GameType;

	@IsNotEmpty()
    @ApiProperty()
    level: number;

	@IsNotEmpty()
    @ApiProperty()
    state: GameState;

}

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserGameDto } from "./create-user-game.dto";
import { GameState } from "@prisma/client";

export class CreateGameDto {
	@IsString()
	@ApiProperty({ required: false })
	room?: string;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty()
	state: GameState;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    level: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateUserGameDto)
    @ApiProperty({ type: [CreateUserGameDto] })
    players: CreateUserGameDto[];

	@IsNotEmpty()
	@IsArray()
	@IsString()
	@ApiProperty()
	playerSocketIds: Array<string>;

	@IsNotEmpty()
	@IsArray()
	@IsString()
	@ApiProperty()
	spectatorSocketIds: Array<string>;

    @IsInt()
    @ApiProperty({ required: false })
    winnerId?: number;

}




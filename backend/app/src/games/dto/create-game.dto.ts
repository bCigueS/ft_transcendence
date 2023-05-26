import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserGameDto } from "./create-user-game.dto";

export class CreateGameDto {

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    level: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateUserGameDto)
    @ApiProperty({ type: [CreateUserGameDto] })
    players: CreateUserGameDto[];

    @IsInt()
    @ApiProperty({ required: false })
    winnerId?: number;

}

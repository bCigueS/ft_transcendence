import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateSpectatorGameDto {
	@IsInt()
	@ApiProperty({ required: false })
	userId: number;
}
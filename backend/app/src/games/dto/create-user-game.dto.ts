import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateUserGameDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userId: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateUserGameDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userId: number;

    // @IsNotEmpty()
    // @IsInt()
    // @ApiProperty()
    // gameId: number;

    // @IsNotEmpty()
    // @IsInt()
    // @ApiProperty()
    // playerIndex: number;

    // @IsNotEmpty()
    // @IsInt()
    // @ApiProperty()
    // score?: number;

}

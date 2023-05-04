import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
// import { Friendship } from '.prisma/client';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	@MinLength(5)
    @ApiProperty()
    name: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
    @ApiProperty()
    email: string;

	@IsString()
	@IsNotEmpty()
    @ApiProperty()
    password: string;

	@ApiProperty()
	friends: any;

	@IsString()
	@MaxLength(255)
	@IsOptional()
	@ApiProperty()
	avatar: string;

}

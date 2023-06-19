import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	@MinLength(5)
    @ApiProperty()
    name: string;

	@IsString()
	@IsNotEmpty()
    @ApiProperty()
    login: string;

	@IsInt()
	@IsNotEmpty()
    @ApiProperty()
    id42: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
    @ApiProperty()
    email: string;

	@IsString()
	@IsNotEmpty()
    @ApiProperty()
    password: string;

	@IsString()
	@MaxLength(255)
	@IsOptional()
	@ApiProperty()
	avatar: string;

}

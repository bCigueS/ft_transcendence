import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { GameState } from '@prisma/client';
import { CreateUserGameDto } from './create-user-game.dto';
import { Type } from 'class-transformer';

export class UpdateGameDto extends PartialType(CreateGameDto) { }

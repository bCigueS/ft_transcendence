import { IsNotEmpty, IsNumber } from 'class-validator';

export class BlockingDto {
    @IsNotEmpty()
    @IsNumber()
    blockedId: number;
}

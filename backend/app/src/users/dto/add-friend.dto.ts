import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddFriendDto {
    @IsNotEmpty()
    @IsNumber()
    friendId: number;
}

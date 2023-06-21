import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
    @ApiProperty()
    senderId: number;

    @ApiProperty()
    content: string;

	@ApiProperty()
    channelId: number;
}

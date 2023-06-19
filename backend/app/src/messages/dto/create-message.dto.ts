import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
    @ApiProperty()
    senderId: number;

    @ApiProperty()
    content: string;

	@ApiProperty()
    channelId: number;
}

export class CreateChannelMembershipDto {
    @ApiProperty({ description: 'The ID of the user to add to the channel' })
    userId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Message, User } from '@prisma/client'
import { Channel } from 'diagnostics_channel';

export class MessageEntity implements Message {
    @ApiProperty()
	id: number;

    @ApiProperty()
	createdAt: Date;

    @ApiProperty()
	senderId: number;

    @ApiProperty()
	sender: User;

    @ApiProperty()
	content: string;

    @ApiProperty()
	channelId: number;

    @ApiProperty()
	channel: Channel;
}

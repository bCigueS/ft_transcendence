import { ApiProperty } from "@nestjs/swagger";
import { ChannelMembership, Message } from "@prisma/client";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";

export class CreateChannelMembershipDto {
    @ApiProperty({ description: 'The ID of the user to add to the channel' })
    userId: number;
}

export class CreateChannelDto {

    @ApiProperty({ description: 'The id of the user creating this channel.' })
    creatorId: number;

    @ApiProperty({ description: 'The name of the channel', default: 'private' })
    name?: string;

    @ApiProperty({ description: 'Tell whether channel should be protected', default: 'false' })
    isPasswordProtected?: boolean;

    @ApiProperty({ description: 'The password of the channel', default: '' })
    password?: string;

    @ApiProperty({ description: 'The first message sent creating a channel // not mandatory when creating a channel', type: [CreateMessageDto] })
    messages?: CreateMessageDto[]; 

    @ApiProperty({ description: 'The initial members of the channel ', type: [CreateChannelMembershipDto] })
    members: CreateChannelMembershipDto[];

    @ApiProperty({ description: 'Admins of channel ', type: [CreateChannelMembershipDto] })
    admins?: CreateChannelMembershipDto[];

    @ApiProperty({ description: 'Banned users in channel ', type: [CreateChannelMembershipDto] })
    banned?: CreateChannelMembershipDto[];

    @ApiProperty({ description: 'Muted users in channel ', type: [CreateChannelMembershipDto] })
    muted?: CreateChannelMembershipDto[];


}

import { ApiProperty } from "@nestjs/swagger";
import { ChannelMembership, Message } from "@prisma/client";
import { CreateChannelMembershipDto, CreateMessageDto } from "src/messages/dto/create-message.dto";

export class CreateChannelDto {

    @ApiProperty({ description: 'The name of the channel', default: 'private' })
    name?: string;

    @ApiProperty({ description: 'The first message sent creating a channel', type: [CreateMessageDto] })
    messages: CreateMessageDto[]; 

    @ApiProperty({ description: 'The initial members of the channel', type: [CreateChannelMembershipDto] })
    members: CreateChannelMembershipDto[];

}

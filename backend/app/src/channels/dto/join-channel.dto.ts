import { ApiProperty } from "@nestjs/swagger";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";

export class JoinChannelDto {

    @ApiProperty({ description: 'The id of the channel to join.' })
    channelId: number;

    @ApiProperty({ description: 'The user about to join that channel'})
    userId: number;

    @ApiProperty({ description: 'The password of the channel, in case protected', default: '' })
    password?: string;

}

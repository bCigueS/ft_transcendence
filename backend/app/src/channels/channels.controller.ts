import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('channels') @ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	create(@Body() createChannelDto: CreateChannelDto) {
		return this.channelsService.create(createChannelDto);
	}

	@Get()
	findAll() {
		return this.channelsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		const chan = this.channelsService.findOne(id);

		if (!chan)
			throw new NotFoundException(`Channel with ${id} does not exist.`);
		
		return chan;
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateChannelDto: UpdateChannelDto) {
		const chan = this.channelsService.findOne(id);
		
		if (!chan)
		throw new NotFoundException(`Channel with ${id} does not exist.`);
		
		return this.channelsService.update(id, updateChannelDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		
		const chan = this.channelsService.findOne(id);
		
		if (!chan)
		throw new NotFoundException(`Channel with ${id} does not exist.`);
		
		return this.channelsService.remove(id);
	}

	@Get('/userId/:id')
	findUserChannels(@Param('id', ParseIntPipe) id: number) {
	const chan = this.channelsService.findUserChannels(id);

	if (!chan)
		throw new NotFoundException(`User with ${id} is not part of any channel.`);
	
	return chan;
	}

}

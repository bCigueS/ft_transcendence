import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChannelDto, CreateChannelMembershipDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { MessagesGateway } from 'src/messages/messages.gateway';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChannelDto: CreateChannelDto) {
    const { creatorId, name, messages, members } = createChannelDto;

    if (members.length < 2) {
      throw new Error("Invalid channel creation request: must include at least two members.");
    }

    const channel = await this.prisma.channel.create({ 
      data: { creatorId, name },
    });

    if (messages && messages.length > 0)
    {
      for (const msg of messages) {
        const messageDto: CreateMessageDto = { 
          content: msg.content, 
          senderId: msg.senderId,
          channelId: channel.id
        };
    
        await this.prisma.message.create({
          data: {
            ...messageDto,
          },
        });
      }
    }
      
    for (const member of members) {
      const memberDto: CreateChannelMembershipDto = { userId: member.userId };
      await this.prisma.channelMembership.create({
        data: {
          ...memberDto,
          channelId: channel.id,
        },
      });
    }

    return this.findOne(channel.id);
  }

  async findAll() {
    return await this.prisma.channel.findMany({
      include: {
        creator: true,
        // messages: true,
        members: {
          select: {
            user: true
          }
        },
        admins: {
          select: {
            user: true
          }
        },
        banned: {
          select: {
            user: true
          }
        },
        muted: {
          select: {
            user: true
          }
        },
      }
    });
  }

  async findOne(id: number) {

    const chan = await this.prisma.channel.findUnique({
		where: { 
			id
			},
			include: {
        creator: true,
			  messages: true,
			  members: {
				  select: {
				    user: true
				},
        }, 
        admins: {
          select: {
            user: true
          }
        },
        banned: {
          select: {
            user: true
          }
        },
        muted: {
          select: {
            user: true
          }
        },
			},
		});
		
	if (chan) {
		return {
		...chan,
		members: chan.members.map(member => member.user)
		};
	}
		
	return null;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {

    const { name, isPasswordProtected, password, messages, members, admins, banned, muted } = updateChannelDto;

    const channel = await this.findOne(id); 

    if (name)
    {
      await this.prisma.channel.update({
        where: { id },
        data: {
          name: name
        }
      });
    }

	await this.prisma.channel.update({
		where: { id },
		data: {
			isPasswordProtected: isPasswordProtected,
		}
	});

    if (isPasswordProtected)
    {
      await this.prisma.channel.update({
        where: { id },
        data: {
          isPasswordProtected: isPasswordProtected,
          password: password,
        }
      });
    }

    if (messages)
    {

      for (const msg of messages) {
        const messageDto: CreateMessageDto = { 
          content: msg.content, 
          senderId: msg.senderId,
		  channelId: channel.id
        };
        await this.prisma.message.create({
          data: {
            ...messageDto,
            channelId: channel.id,
          },
        });
      }
    }

    if (members) {
      for (const member of members) {
        const memberDto: CreateChannelMembershipDto = { userId: member.userId };
        await this.prisma.channelMembership.create({
          data: {
            ...memberDto,
            channelId: channel.id,
          },
        });
      }
    }

    if (admins) {
      for (const admin of admins) {
        const memberDto: CreateChannelMembershipDto = { userId: admin.userId };
        await this.prisma.adminMembership.create({
          data: {
            ...memberDto,
            channelId: channel.id,
          },
        });
      }
    }

    if (banned) {
      for (const ban of banned) {
        const memberDto: CreateChannelMembershipDto = { userId: ban.userId };
        await this.prisma.bannedUser.create({
          data: {
            ...memberDto,
            channelId: channel.id,
          },
        });
      }
    }

    if (muted) {
      for (const mute of muted) {
        const memberDto: CreateChannelMembershipDto = { userId: mute.userId };
        await this.prisma.mutedUser.create({
          data: {
            ...memberDto,
            channelId: channel.id,
          },
        });
      }
    }
	
    const updatedChannel = await this.findOne(id); 
    return updatedChannel;
  }

  async remove(id: number) {

	await this.prisma.message.deleteMany({
		where: { channelId: id },
	});
	
	await this.prisma.channelMembership.deleteMany({
		where: { channelId: id },
	});

  await this.prisma.adminMembership.deleteMany({
		where: { channelId: id },
	});

  await this.prisma.bannedUser.deleteMany({
		where: { channelId: id },
	});

  await this.prisma.mutedUser.deleteMany({
		where: { channelId: id },
	});
	
	const deletedChannel = await this.prisma.channel.delete({
	where: { id },
	});

    return this.findAll();
  }

  async findUserChannels(id: number) {

	const userChannels = await this.prisma.channel.findMany({
		where: {
			members: {
			  some: {
				userId: id,
			  },
			},
		  },
		  include: {
			members: {
			  select: {
				user: {
				  select: {
					id: true,
					email: true,
					name: true,
					avatar: true,
					doubleAuth: true,
					wins: true,
				  }
				}
			  }
			},
      admins: {
			  select: {
				user: {
				  select: {
					id: true,
					email: true,
					name: true,
					avatar: true,
					doubleAuth: true,
					wins: true,
				  }
				}
			  }
			},
      banned: {
			  select: {
				user: {
				  select: {
					id: true,
					email: true,
					name: true,
					avatar: true,
					doubleAuth: true,
					wins: true,
				  }
				}
			  }
			},
      muted: {
			  select: {
				user: {
				  select: {
					id: true,
					email: true,
					name: true,
					avatar: true,
					doubleAuth: true,
					wins: true,
				  }
				}
			  }
			},
			messages: true,
		  },
		});

	const reformattedChannels = userChannels.map(channel => {
		return {
		...channel,
		members: channel.members.map(member => member.user),
		admins: channel.admins.map(admin => admin.user),
		banned: channel.banned.map(ban => ban.user),
		muted: channel.muted.map(mute => mute.user),
		}
	});
	
	return reformattedChannels;
  }

  async removeMember(channelId: number, userId: number) {
    await this.prisma.channelMembership.deleteMany({
      where: { 
        channelId: channelId,
        userId: userId
      },
    });

    return this.findOne(channelId);
  }

  async removeAdmin(channelId: number, userId: number) {
      await this.prisma.adminMembership.deleteMany({
        where: { 
          channelId: channelId,
          userId: userId
        },
      });
      return this.findOne(channelId);
    }

    async banUser(channelId: number, userId: number) {
      const channel = await this.prisma.channel.findUnique({
          where: { id: channelId },
      });
      if (!channel)
        throw new NotFoundException('Channel not found');
        
      await this.prisma.bannedUser.create({
          data: { 
              channelId: channelId,
              userId: userId 
          },
      });
  
      return this.findOne(channelId);
  }

  async removeBan(channelId: number, userId: number) {
    await this.prisma.bannedUser.deleteMany({
      where: { 
        channelId: channelId,
        userId: userId
      },
    });
    return this.findOne(channelId);
  }

  async removeMute(channelId: number, userId: number) {

    await this.prisma.mutedUser.deleteMany({
      where: { 
        channelId: channelId,
        userId: userId
      },
    });

    return this.findOne(channelId);
  }

  async kickUser(channelId: number, userId: number) {

    const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
    });
    if (!channel) 
      throw new NotFoundException('Channel not found');

	
	const member = await this.prisma.channelMembership.findUnique({
        where: { channelId_userId: { channelId, userId } },
	});

	if (member) {
		await this.prisma.channelMembership.delete({
			where: { channelId_userId: { channelId, userId } },
		});
	}

    const admin = await this.prisma.adminMembership.findUnique({
        where: { channelId_userId: { channelId, userId } },
    });
    if (admin) {
        await this.prisma.adminMembership.delete({
            where: { channelId_userId: { channelId, userId } },
        });
    }

    const muted = await this.prisma.mutedUser.findUnique({
        where: { channelId_userId: { channelId, userId } },
    });
    if (muted) {
        await this.prisma.mutedUser.delete({
            where: { channelId_userId: { channelId, userId } },
        });
    }

    return this.findOne(channelId);
  }

  async join(channelId: number, JoinChannelDto: JoinChannelDto)
  {
    console.log('in join channels service');

    const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
    });

    if (!channel)
    {
      console.log('did not find channel');
      throw new NotFoundException('Channel not found');
    }

	const userId = JoinChannelDto.userId;

	const isMember = await this.prisma.channelMembership.findUnique({
        where: { channelId_userId: { channelId, userId } },
	})

	if (isMember) {
	  throw new BadRequestException('You are already a member of this channel');
	}  

	const isBanned = await this.prisma.bannedUser.findUnique({
        where: { channelId_userId: { channelId, userId } },
    });

	if (isBanned) {
	  throw new ForbiddenException('You are banned from this channel');
	}  

    if (channel.isPasswordProtected && (!JoinChannelDto.password || JoinChannelDto.password.length === 0))
      throw new UnauthorizedException('You need to provide a password to enter that channel');

    if (channel.isPasswordProtected && (channel.password !== JoinChannelDto.password))
      throw new UnauthorizedException('Wrong password provided');
    
    const memberDto: CreateChannelMembershipDto = { userId: JoinChannelDto.userId };
    await this.prisma.channelMembership.create({
      data: {
        ...memberDto,
        channelId: channel.id,
      },
    });

    return channel;
  }

}

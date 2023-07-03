import { UserAPI } from "../../store/users-contexte";

export interface Channel {
    createdAt: Date,
	id: number,
	name: string,
    creatorId: number | undefined,
    creator?: UserAPI,
    isPasswordProtected?: boolean,
    password?: string,
	messages: MessageAPI[],
	members: UserAPI[],
	admins?: UserAPI[],
	banned?: UserAPI[],
	muted?: UserAPI[],
}

export interface MessageAPI {
	createdAt: Date,
	id: number,
	senderId: number | undefined,
	content: string,
	channelId: number,
}

type User = { userId: number | undefined };
type CreateChannelDTO = {
  name: string,
  members: User[],
  isPasswordProtected?: boolean,
  password?: string,
  admins?: User[],
  banned?: User[],
  muted?: User[],
};

export type UpdateChannelDTO = {
    name?: string,
    members?: User[],
    isPasswordProtected?: boolean,
    password?: string,
    admins?: User[],
    banned?: User[],
    muted?: User[],
  };

export type JoinChannelDTO = {
	channelId: number,
    userId: number,
    password?: string,
}


export const createNewChannel = async (chanData: CreateChannelDTO) => {

    try {

        const response = await fetch('http://localhost:3000/channels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chanData)
        });
        
        if (response.status === 422 || response.status === 400 || response.status === 401 || response.status === 404) {
            return response;
        }
        
        if (!response.ok) {
            throw new Error("Could not create new channel.");
        }
        const resData = await response.json();
        return resData;

    } catch (error: any) {
        console.log(error.message);
    }
}

export const deleteChat = async (chat: Channel) => {
    try {
        const response = await fetch('http://localhost:3000/channels/' + chat.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.status === 400) {
            throw new Error("Failed to delete chat!") ;
        }

        if (!response.ok)
            throw new Error("Failed to delete chat!") ;

            
        } catch (error: any) {
            console.log(error.message);
    }
};

export const modifyChannel = async (channelId: number, chanData: UpdateChannelDTO) => {

    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chanData)
        });
    
        if (response.status === 400) {
            throw new Error("Failed to modify channel!") ;
        }

        if (!response.ok)
            throw new Error("Failed to modify channel!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }
};

export const removeAdmin = async (channelId: number, adminId: number) => {

    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId + '/admins/' + adminId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.status === 400) {
            throw new Error("Failed to remove user from channel admins!") ;
        }

        if (!response.ok)
            throw new Error("Failed to remove user from channel admins!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }

};

export const removeBan = async (channelId: number, adminId: number) => {

    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId + '/banned/' + adminId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.status === 400) {
            throw new Error("Failed to remove user from banned users!") ;
        }

        if (!response.ok)
            throw new Error("Failed to remove user from banned users!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }

};

export const removeMute = async (channelId: number, adminId: number) => {

    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId + '/muted/' + adminId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.status === 400) {
            throw new Error("Failed to remove user from muted users!") ;
        }

        if (!response.ok)
            throw new Error("Failed to remove user from muted users!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }

};

export const kickUser = async (channelId: number, userId: number) => {

    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId + '/kick/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.status === 400) {
            throw new Error("Failed to kick user from channel!") ;
        }

        if (!response.ok)
            throw new Error("Failed to kick user from channel!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }

};

export const banUser = async (channelId: number, userId: number) => {

    kickUser(channelId, userId);
    try {
        const response = await fetch('http://localhost:3000/channels/' + channelId + '/ban/' + userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.status === 400) {
            throw new Error("Failed to ban user!") ;
        }

        if (!response.ok)
            throw new Error("Failed to ban user!") ;
        
    } catch (error: any) {
        console.log(error.message);
    }

};

export const fetchChannelById = async (channelId: number) => {

	let channelFound: Channel | null = null;
	
    console.log('in fetchChannelById with id: ', channelId);
	try {
		const response = await fetch('http://localhost:3000/channels/' + channelId);

		if (!response.ok)
			throw new Error('Failed to fetch channel with id ' + channelId);

		const data = await response.json();

		channelFound = {
			id: data.id,
			createdAt: data.createdAt,
			name: data.name,
			creatorId: data.creatorId,
			creator: data.creator,
			isPasswordProtected: data.isPasswordProtected,
			password: data.password,
			messages: data.messages,
			members: data.members,
			admins: data.admins,
			banned: data.banned,
			muted: data.muted,
		}
    	return channelFound;


	} catch (error: any) {
		console.error(error.message);
	}
	return channelFound;
};

export const isMemberMuted = async (channelId: number, memberId: number) =>
{
	try {
		const channel = await fetchChannelById(channelId);

		if (!channel) {
			throw new Error('Channel not found');
		}

		const mutedMembers = channel.muted;

		if (mutedMembers)
		{
			for (const mutedMember of mutedMembers) {
				if (mutedMember.id === memberId) {
					return true;
				}
			}
		}
			
		return false;

	} catch (error: any) {
		console.error(error.message);
		return false;
	}
}



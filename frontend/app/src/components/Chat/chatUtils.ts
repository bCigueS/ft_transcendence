import { UserAPI } from "../../store/users-contexte";

export interface Channel {
    createdAt: Date,
	id: number,
	name: string,
	messages: MessageAPI[],
	members: UserAPI[],
}

export interface MessageAPI {
	createdAt: Date,
	id: number,
	senderId: number | undefined,
	content: string,
	channelId: number,
}

type User = { userId: number | undefined };
type ChannelDTO = {
  name: string,
  members: User[]
};

export const createNewChannel = async (chanData: ChannelDTO) => {

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
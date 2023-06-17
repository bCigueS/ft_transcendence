import { UserAPI } from "../../store/users-contexte";

export interface Channel {
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
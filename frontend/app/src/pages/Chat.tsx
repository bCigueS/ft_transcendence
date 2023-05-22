import { useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI } from '../store/users-contexte';

export interface Message {
	id: number,
	senderId: number,
	message: string,
}

export interface Channel {
	id: number,
	members: UserAPI,
	messages: Message,
}

export interface ChatAPI {
	// sender: UserAPI,
	id: number,
	// sender: string;
	senderId: number;
	messages?: string[],
	lastMessage: string,

}

export interface Message {

}

export default function Chat() {
	
	const [ selectedConversation, setSelectedConversation ] = useState<number>(0);

	const onSaveConversation = (channelId: number) => {
		setSelectedConversation(channelId);
	}

	const chatWithFany: ChatAPI = {
		id: 1,
		senderId: 2,

		lastMessage: 'btw what do you think about this?'
	}
	
	const chatWithFlo: ChatAPI = {
		id: 2,
		senderId: 3,
		lastMessage: 'haha '
	}
	
	const chatWithPasca: ChatAPI = {
		id: 3,
		senderId: 4,
		lastMessage: "J'ecris le brouillon et je te le montre avant d'envoyer."
	}
	
	const chatList: ChatAPI[] = [
		chatWithFany,
		chatWithFlo,
		chatWithPasca,
	]

	// const [ chatList, setChatList ] = useState<Chat[]>([]);
	
	const chats: ChatAPI[] = chatList;

	const displayConvo = (chatList: ChatAPI[], channelId: number) => {
		if (selectedConversation === 0)
			return "no convo selected";
		return chatList[selectedConversation - 1].lastMessage;
	}

	return (
		<div className={classes.page}>
			{/* <div className={classes.searchbar}>
				lol
			</div> */}
			<div className={classes.conversations}>
				{
					chats.map((chat) => (
					<ChatInfo key={chat.id} chat={chat} onSaveConversation={onSaveConversation}/>
				 	))
				}
			</div>
			<div className={classes.message}>
				{
					displayConvo(chatList, selectedConversation)
				}
			</div>
		</div>
	)
}
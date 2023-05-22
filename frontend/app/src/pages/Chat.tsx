import { useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI } from '../store/users-contexte';

export interface ChatAPI {
	// sender: UserAPI,
	id: number,
	// sender: string;
	senderId: number;
	lastMessage: string,

}

export interface Message {

}

export default function Chat() {
	
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

	return (
		<div className={classes.page}>
			{/* <div className={classes.searchbar}>
				lol
			</div> */}
			<div className={classes.conversations}>
				{
					chats.map((chat) => (
					<ChatInfo key={chat.id} chat={chat} />
				 	))
				}
			</div>
			<div className={classes.message}>
				hoho
			</div>
		</div>
	)
}
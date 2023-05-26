import { useRef, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI } from '../store/users-contexte';
import Message from '../components/Chat/Message';
import NoConvo from '../components/Chat/NoConvo';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
		transports: ["websocket"],
		}
	);

export interface Message {
	createdAt: Date,
	id: number,

	senderId: number,
	sender: UserAPI,

	content: string,

	channelId: number,
	channel: Channel
}

export interface Channel {
	id: number,
	name: string,

	messages: Message[],
	members: UserAPI[],

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
	const messageInput = useRef<HTMLInputElement>(null);

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

	
	const displayConvo2 = (chatList: ChatAPI[], channelId: number) => {
		
		// const [ message, setMessage ] = useState('');
		
		
		const handleSubmit = (event: { preventDefault: () => void; }) => {
			
			event.preventDefault();
			
			const enteredText = messageInput.current!.value;
	
			if (enteredText.trim().length === 0) {
				return ;
			}
			
			socket.emit('send', {content: enteredText});

			console.log('message input: ', enteredText);
			
			messageInput.current!.value = '';
		  }

		  if (selectedConversation === 0)
			return <NoConvo/>;
		return (
			<div className={classes.message}>
				<Message isMine={false} isLast={false} message={displayConvo(chatList, selectedConversation)}/>
				<Message isMine={false} isLast={false} message={displayConvo(chatList, selectedConversation)}/>
				<Message isMine={false} isLast={true} message={displayConvo(chatList, selectedConversation)}/>
				<Message isMine={true} isLast={true} message={displayConvo(chatList, selectedConversation)}/>
				<form onSubmit={handleSubmit}>
					<input className={classes.sendInput} type="text" ref={messageInput} placeholder='type here...' />
					{/* <button> */}
						{/* <i className='fa-sharp fa-solid fa-paper-plane'></i> */}
					{/* </button> */}
				</form>
			</div>
		);


	}

	return (
		<div className={classes.page}>
			<div className={classes.conversations}>
				{
					chats.map((chat) => (
					<ChatInfo key={chat.id} chat={chat} onSaveConversation={onSaveConversation}/>
				 	))
				}
			</div>

			{
				displayConvo2(chatList, selectedConversation)
			}
			{/* <div className={classes.message}> */}
				{/* <Message isMine={false} isLast={false} message={displayConvo(chatList, selectedConversation)}/> */}
				{/* <Message isMine={false} isLast={false} message={displayConvo(chatList, selectedConversation)}/> */}
				{/* <Message isMine={false} isLast={true} message={displayConvo(chatList, selectedConversation)}/> */}
				{/* <Message isMine={true} isLast={true} message={displayConvo(chatList, selectedConversation)}/> */}
				{/* <form> */}
					{/* <input className={classes.sendInput} type="text" placeholder='type here...' /> */}
					{/* <button> */}
						{/* <i className='fa-sharp fa-solid fa-paper-plane'></i> */}
					{/* </button> */}
				{/* </form> */}
			{/* </div> */}
		</div>
	)
}
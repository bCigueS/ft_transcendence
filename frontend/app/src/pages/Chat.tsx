import { useContext, useEffect, useRef, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import Message from '../components/Chat/Message';
import NoConvo from '../components/Chat/NoConvo';
import io, { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

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

export default function Chat() {
	
	const [ selectedConversationId, setSelectedConversationId ] = useState<number>(0);
	const [ chats, setChats ] = useState<Channel[]>([]);
	const [ socket, setSocket ] = useState<Socket>();
	const [ messages, setMessages ] = useState<MessageAPI[] >([]);

	const messageInput = useRef<HTMLInputElement>(null);
	const userCtx = useContext(UserContext);
	const location = useLocation();
	
	/*
		FUNCTIONS TO RENDER MESSAGE CORRECTLY IN FRONT
	*/

	const isMine = (message: MessageAPI) => {
		
		if (message.senderId === userCtx.user?.id)
		return (true);
		return false;
	}
	
	const isLast = (message: MessageAPI) => {
		
		const messageIndex = messages.findIndex(m => m.id === message.id);
		if (messageIndex === messages.length - 1
			|| messages[messageIndex + 1].senderId !== message.senderId)
			return (true);
			return false;
	}
			
	const displayDay = (message: MessageAPI) => {
		const messageIndex = messages.findIndex(m => m.id === message.id);
		if (messageIndex === 0
			|| messages[messageIndex - 1].createdAt.toDateString() !== message.createdAt.toDateString())
			return (true);
		return false;
	}

	/*
		FUNCTIONS FOR MESSAGING
	*/
	
	useEffect(() => {
		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
	}, [setSocket])
	
	const send = (content: string, selectedConversation: number) => {
		const message = {
		  content: content,
		  channelId: selectedConversation,
		  senderId: userCtx.user?.id
		};
		socket?.emit("message", message);
	}

	const messageListener = (message: {
		id: number,
		senderId: number,
		content: string,
		channelId: number
	}) => {
		const newMessage = {
			id: message.id,
			createdAt: new Date(),
            senderId: message.senderId,
            content: message.content,
            channelId: message.channelId,
        };
		setMessages([...messages, newMessage]);
	}
	
	useEffect(() => {
		socket?.on("message", messageListener);
		return () => {
			socket?.off("message", messageListener);
		}
	}, [messageListener])

	/*
		FUNCTION TO DELETE MESSAGE
	*/

	const handleDeleteMessage = (message: MessageAPI) => {
		console.log('about to delete: ', message.content);
		socket?.emit('')

	}

	/*
		FETCH USER CURRENT CONVOS
	*/
	
    useEffect(() => {
		fetch('http://localhost:3000/channels/userId/' + userCtx.user?.id)
		.then(response => response.json())
		.then(data => {
			data.forEach((channel: Channel) => {
				channel.messages.forEach(message => {
					message.createdAt = new Date(message.createdAt);
				});
                });
				
                setChats(data);
            })
            .catch(err => console.error('An error occurred:', err));
	}, []);

	/*
		FUNCTIONS WHEN SPECIFIC CHAT IS SELECTED
	*/

	const onSaveConversation = (channelId: number) => {
		setSelectedConversationId(channelId);
	}

	useEffect(() => {
		let selectedChannel = chats.find(chat => chat.id === selectedConversationId);
		if (selectedChannel)
			setMessages(selectedChannel.messages);
	}, [selectedConversationId]);

	/*
		CREATE DUMMY CHAT WHEN START DISCUSSION
	*/

	useEffect(() => {
		if (chats) {
			checkPreviousPage();
		}
	}, [chats]);

	const checkPreviousPage = () => {

		if (location?.state?.newChat) {

			const user = location?.state?.newChat;
			const chatExist = chats.find(chat =>
				chat.name === 'private' && chat.members.some(member => member.id === user.id));
	
			if (chatExist)
				onSaveConversation(chatExist.id);
			else
			{
				const newChat = {
					id: -1,
					name: 'private',
					messages: [],
					members: [user, userCtx.user]
				}
				setChats([...chats, newChat]);
				onSaveConversation(newChat.id);
			}
		}
	}
	
	const displayConvo = (channelId: number) => {
		const handleSubmit = (event: { preventDefault: () => void; }) => {
			event.preventDefault();
			const enteredText = messageInput.current!.value;
	
			if (enteredText.trim().length === 0) {
				return ;
			}
			send(enteredText, selectedConversationId);
			messageInput.current!.value = '';
		  }

		if (channelId === 0)
			return <NoConvo/>;
		return (
			<div className={classes.message}>
				{
					messages.map((message) => 
						<Message key={message.id}
								isMine={isMine(message)}
								isLast={isLast(message)}
								displayDay={displayDay(message)}
								message={message}
								messages={messages}
								onDelete={handleDeleteMessage}/>)
				}

				<form onSubmit={handleSubmit}>
					<input className={classes.sendInput} 
							type="text"
							ref={messageInput}
							placeholder='type here...' />
				</form>
			</div>
		);
	}

	return (
		<div className={classes.page}>
			<div className={classes.conversations}>
				{
					chats.map((chat) => (
					<ChatInfo key={chat.id} 
							chat={chat}
							isSelected={chat.id === selectedConversationId ? true : false}
							onSaveConversation={onSaveConversation}/>
				 	))
				}
			</div>
			{
				displayConvo(selectedConversationId)
			}
		</div>
	)
}
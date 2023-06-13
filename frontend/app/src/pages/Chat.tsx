import { useContext, useEffect, useRef, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import Message from '../components/Chat/Message';
import NoConvo from '../components/Chat/NoConvo';
import io, { Socket } from 'socket.io-client';

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
	const [ selectedConversation, setSelectedConversation ] = useState<Channel | null>();
	const [ chats, setChats ] = useState<Channel[]>([]);
	const [ socket, setSocket ] = useState<Socket>();
	const [ messages, setMessages ] = useState<MessageAPI[] >([]);

	const messageInput = useRef<HTMLInputElement>(null);
	const userCtx = useContext(UserContext);


	const send = (content: string, selectedConversation: number) => {

		const message = {
		  content: content,
		  channelId: selectedConversation,
		  senderId: userCtx.user?.id
		};

		console.log('sending message: ', content);
		console.log('message sender: ', message.senderId);
	  
		socket?.emit("message", message);
	}

	useEffect(() => {
		console.log('in useEffect to connect with socket gateway');

		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
	}, [setSocket])

	const messageListener = (message: {
				senderId: number,
				content: string,
				channelId: number
			}) => {
		console.log('in messageListner with message object: ', message);
		const newMessage = {
			id: Math.random(),
			createdAt: new Date(),
            senderId: message.senderId,
            content: message.content,
            channelId: message.channelId,
        };
		setMessages([...messages, newMessage]);
		console.log('new message: ', newMessage.content);
		console.log(isMine(newMessage) ? 'just sent this new message' : 'I just received a new message.');
	}

	useEffect(() => {
		console.log('in useEffect socket for instant message');

		socket?.on("message", messageListener);
		return () => {
			socket?.off("message", messageListener);
		}
	}, [messageListener])

    useEffect(() => {
		console.log('in useEffect to fetch user channels');
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

	const isMine = (message: MessageAPI) => {
		// console.log('message: ', message.content);
		// if (isMine(message))
		// 	console.log('message is mine.');
		// else
		// 	console.log('message is NOT mine.');

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

	const onSaveConversation = (channelId: number) => {
		setSelectedConversationId(channelId);

		let selectedChannel = chats.find(chat => chat.id === channelId);
		setSelectedConversation(selectedChannel);

		if (selectedChannel)
			setMessages(selectedChannel.messages);
	}

	const handleDeleteMessage = (message: MessageAPI) => {
		console.log('about to delete: ', message.content);
		socket?.emit('')

	}
	
	const displayConvo = () => {

		const handleSubmit = (event: { preventDefault: () => void; }) => {
			event.preventDefault();
			const enteredText = messageInput.current!.value;
	
			if (enteredText.trim().length === 0) {
				return ;
			}
			send(enteredText, selectedConversationId);
			messageInput.current!.value = '';
		  }

		if (selectedConversationId === 0)
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
							onSaveConversation={onSaveConversation}/>
				 	))
				}
			</div>
			{
				displayConvo()
			}
		</div>
	)
}
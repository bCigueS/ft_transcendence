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
	  
		socket?.emit("message", message);
	}

	useEffect(() => {
		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
	}, [setSocket])

	const messageListener = (message: string) => {
		const newMessage = {
			id: Math.random(),
			createdAt: new Date(),
            senderId: userCtx.user?.id,
            content: message,
            channelId: selectedConversationId,
        };
		setMessages([...messages, newMessage]);
	}

	useEffect(() => {
		socket?.on("message", messageListener);
		return () => {
			socket?.off("message", messageListener);
		}
	}, [messageListener])

    useEffect(() => {
        fetch('http://localhost:3000/channels/userId/1')
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
	
	const displayConvo = (chatList: Channel[], channelId: number) => {

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
				displayConvo(chats, selectedConversationId)
			}
		</div>
	)
}
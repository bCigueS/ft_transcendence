import { useContext, useEffect, useRef, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import modalclasses from  '../sass/components/Game/Modal.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import Message from '../components/Chat/Message';
import NoConvo from '../components/Chat/NoConvo';
import io, { Socket } from 'socket.io-client';
import { json, useLocation } from 'react-router-dom';
import MessageList from '../components/Chat/MessageList';

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
	
	const [ selectedConversation, setSelectedConversation ] = useState<Channel>();

	const [ chats, setChats ] = useState<Channel[]>([]);
	const [ socket, setSocket ] = useState<Socket>();
	const [ messages, setMessages ] = useState<MessageAPI[] >([]);

	const userCtx = useContext(UserContext);
	const location = useLocation();

	/*
		FUNCTIONS FOR MESSAGING
	*/
	
	useEffect(() => {
		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
	}, [setSocket])

	const createNewChannel = async () => {

		let senderId;

		const newChat = chats.find(chat =>
			chat.id === -1);

		newChat?.members.forEach((member) => {
			if (member.id != userCtx.user?.id)
				senderId = member.id;
		})

		const chanData = {
			name: "private",
			members: [
			  {
				userId: userCtx?.user?.id
			  },
			  {
				userId: senderId
			  }
			]
		}

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
			throw json({message: "Could not create new channel."}, {status: 500});
		}
	
		const resData = await response.json();
		return resData;
	}
	
	const send = async (content: string, selectedConversationId: number) => {

		const message = {
		  content: content,
		  channelId: selectedConversationId,
		  senderId: userCtx.user?.id
		};

		if (selectedConversationId === -1)
		{
			const newChan = await createNewChannel();
			message.channelId = newChan.id;
		}
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
	  
		const newChats = [...chats];
		const chatIndex = newChats.findIndex(chat => chat.id === newMessage.channelId);
	  
		if (chatIndex !== -1) {
		  newChats[chatIndex].messages = [...newChats[chatIndex].messages, newMessage];
		  setChats(newChats);
		} else {
			const createNewChat = async () => {
			const sender = await userCtx.fetchUserById(message.senderId);

			if (sender !== null) {
				throw new Error('Could not fetch sender');
			}
			
			const user = userCtx.user;
			if(!user) {
				throw new Error('User not available');
			}
			
			const newChat = {
				id: message.channelId,
				name: 'private',
				messages: [newMessage],
				members: [user, sender],
			};
			
			setChats([...newChats, newChat]);
			}
			createNewChat();
		}
	  };
	  
	
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

	const onSaveConversation = (channel: Channel) => {
		setSelectedConversation(channel);
		socket?.emit('join', channel.id);
	}

	useEffect(() => {
		let selectedChannel = chats.find(chat => chat.id === selectedConversation?.id);
		if (selectedChannel)
			setMessages(selectedChannel.messages);
	}, [selectedConversation]);

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
				onSaveConversation(chatExist);
			else
			{
				const newChat = {
					id: -1,
					name: 'private',
					messages: [],
					members: [user, userCtx.user]
				}

				setChats([...chats, newChat]);
				onSaveConversation(newChat);
			}
		}
	}

	return (
		<div className={classes.page}>

			<div className={classes.conversations}>
				{
					chats.map((chat) => (
						<ChatInfo key={chat.id}
						chats={chats}
						chat={chat}
						isSelected={chat.id === selectedConversation?.id ? true : false}
						onSaveConversation={onSaveConversation}/>
						))
					}
			</div>
			{
				selectedConversation ? 
				<MessageList send={send} chat={selectedConversation} chats={chats}/>
				: <NoConvo/>
			}
		</div>
	)
}
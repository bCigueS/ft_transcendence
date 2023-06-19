import { useContext, useEffect, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserContext } from '../store/users-contexte';
import NoConvo from '../components/Chat/NoConvo';
import io, { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import MessageList from '../components/Chat/MessageList';
import { Channel, MessageAPI, createNewChannel, deleteChat } from '../components/Chat/chatUtils';
import ManageChats from '../components/Chat/ManageChats';
import NoDiscussions from '../components/Chat/NoDiscussions';

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

	const send = async (content: string, selectedConversationId: number) => {

		const message = {
		  content: content,
		  channelId: selectedConversationId,
		  senderId: userCtx.user?.id
		};

		if (selectedConversationId === -1)
		{
			let senderId;

			const newChat = chats.find(chat =>
				chat.id === -1);

			newChat?.members.forEach((member) => {
				if (member.id !== userCtx.user?.id)
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

			const newChan = await createNewChannel(chanData);
			message.channelId = newChan.id;

			const dummyChatIndex = chats.findIndex(chat => chat.id === -1);

			if (dummyChatIndex !== -1) {
			  const updatedChats = chats.filter((_, index) => index !== dummyChatIndex);
			  setChats([...updatedChats, newChan]);
			} else {
			  setChats([...chats, newChan]);
			}
			onSaveConversation(newChan);
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
	  

		if (chatIndex !== -1 && newChats[chatIndex].messages) {
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
				createdAt: new Date(),
				id: message.channelId,
				name: 'private',
				messages: [newMessage],
				members: [user, sender],
			};
			
			setChats([...newChats, newChat]);
			}
			createNewChat();
		}

		console.log('received message in message listener: ', newMessage.content);
	  };

	const joinListener = (channelId: string) => {
		console.log('client joined channel ', channelId);
		socket?.emit('join', parseInt(channelId, 10));
		fetchChannels();
	  }
	  
	useEffect(() => {
		socket?.on("message", messageListener);
		return () => {
		  socket?.off("message", messageListener);
		}
	}, [socket, messageListener]);
	  
	useEffect(() => {
		socket?.on("join", joinListener);
		return () => {
		  socket?.off("join", joinListener);
		}
	}, [socket, joinListener]);

	useEffect(() => {
		socket?.on('chatDeleted', (data) => {
			if (chats.find(chat => chat.id === data.chatId)) {
				setChats(chats => chats.filter(chat => chat.id !== data.chatId));
			}
		});
	
		return () => {
			socket?.off('chatDeleted');
		};
	}, [chats, socket]);

	const checkLastMessageDeleted = (message: MessageAPI) => {
		const chatMessage = chats.find(chat => chat.id === message.channelId);

		if (chatMessage?.messages.length === 0)
		{
			deleteChat(chatMessage);
			handleChatDeletion(chatMessage.id);
		}
	}

	useEffect(() => {
		socket?.on("messageDeleted", (deletedMessage) => {
			const chatIndex = chats.findIndex(chat => chat.id === deletedMessage.channelId);
			if (chatIndex !== -1) {
				const messageIndex = chats[chatIndex].messages.findIndex(msg => msg.id === deletedMessage.id);
				if (messageIndex !== -1) {
					const newChats = [...chats]; 
					newChats[chatIndex].messages.splice(messageIndex, 1);
					setChats(newChats);
				}
			}
			checkLastMessageDeleted(deletedMessage);
		});

		return () => {
			socket?.off('messageDeleted');
		};
	}, [chats, socket]);
	  
	useEffect(() => {
		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
		newSocket.on('connect', () => {
		  newSocket.emit('user_connected', userCtx.user?.id);
		});
	  
		return () => {
		  newSocket.removeAllListeners();
		}
	}, [setSocket]);

	const handleMessageDeletion = (message: MessageAPI) => {
		console.log('about to delete: ', message.content);
		socket?.emit('messageDeleted', { message: message })
	}

	const handleChatDeletion = (id: number) => {
		setChats(chats => chats.filter(chat => chat.id !== id));
		socket?.emit('chatDeleted', { chatId: id, userId: userCtx.user?.id });
	};

	const fetchChannels = async() => {
		try {
			const response = await fetch('http://localhost:3000/channels/userId/' + userCtx.user?.id, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			});
		
			if (response.status === 400) {
				throw new Error("Failed to fetch user channels!") ;
			}

			if (!response.ok)
				throw new Error("Failed to fetch user channels!") ;

			const data = await response.json();
			setChats(data);
			
		} catch (error: any) {
			console.log(error.message);
		}
	}
	
    useEffect(() => {
		fetchChannels();
	}, []);

	useEffect(() => {
		if(socket && chats.length > 0) {
			chats.forEach(chat => {
				socket.emit('join', chat.id);
			});
		}
	}, [socket, chats]);

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

	chats.sort((a, b) => {

		let lastMessageDateA;
		if (a.messages.length === 0)
			lastMessageDateA = a.createdAt.toString();
		else
			lastMessageDateA = a.messages[a.messages.length - 1].createdAt.toString();
		let lastMessageDateB;
		if (b.messages.length === 0)
			lastMessageDateB = b.createdAt.toString();
		else
			lastMessageDateB = b.messages[b.messages.length - 1].createdAt.toString();
	  
		const timestampA = Date.parse(lastMessageDateA);
		const timestampB = Date.parse(lastMessageDateB);
	  
		return timestampB - timestampA;
	});

	return (
		<div className={classes.page}>
			<div className={classes.conversations}>
				< ManageChats />
				{
					chats && chats.length > 0 ?
					chats.map((chat) => (
						<ChatInfo key={chat.id}
						chats={chats}
						chat={chat}
						isSelected={chat.id === selectedConversation?.id ? true : false}
						onSaveConversation={onSaveConversation}
						onDeleteChat={handleChatDeletion}/>
						))
					:
					<NoDiscussions/>
				}
			</div>
			{
				selectedConversation &&
				(chats.length > 0) ? 
				<MessageList
					send={send} 
					chat={selectedConversation} 
					chats={chats}
					onDelete={handleMessageDeletion}/>
				: <NoConvo/>
			}
		</div>
	)
}
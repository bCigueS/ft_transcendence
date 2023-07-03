import { useCallback, useContext, useEffect, useState } from 'react';
import ChatOverview from '../components/Chat/ChatOverview';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import NoConvo from '../components/Chat/NoConvo';
import io, { Socket } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import MessageList from '../components/Chat/MessageList';
import { Channel, JoinChannelDTO, MessageAPI, createNewChannel, deleteChat } from '../components/Chat/chatUtils';
import ManageChats from '../components/Chat/ManageChats';
import NoDiscussions from '../components/Chat/NoDiscussions';

type JoinResponse = {
	status: number;
	error?: string;
  };

export default function Chat() {
	
	const [ selectedConversation, setSelectedConversation ] = useState<Channel>();

	const [ chats, setChats ] = useState<Channel[]>([]);
	const [ socket, setSocket ] = useState<Socket>();
	const [ messages, setMessages ] = useState<MessageAPI[] >([]);
	const userCtx = useContext(UserContext);
	const location = useLocation();
	const navigate = useNavigate();

	let state = location.state?.newChat;
	
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
				creatorId: userCtx.user?.id,
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
			socket?.emit("message", message);
			navigate('/chat');
			return ;
		}
		socket?.emit("message", message);
	}

	const messageListener = useCallback(async (message: {
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
				creatorId: userCtx.user?.id,
				id: message.channelId,
				name: 'private',
				messages: [newMessage],
				members: [user, sender],
			};
			
			setChats([...newChats, newChat]);
			}
			createNewChat();
		}
	  }, [chats, userCtx]);

	  const fetchChannels = useCallback(async() => {
		try {
			const response = await fetch('http://localhost:3000/channels/userId/' + userCtx.user?.id, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + userCtx.logInfo?.token,
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
	}, [userCtx.user?.id, userCtx.logInfo?.token])

	const checkIsBlocked = (blockedId: number): boolean => {
		if (!userCtx.user?.id) {
		  return false;
		}
	  
		const blockedUsers = userCtx.user?.block;
	  
		if (blockedUsers) {
		  return blockedUsers.some((blockedUser) => blockedUser.id === blockedId);
		}
	  
		return false;
	  };
	  
	const filteredChats = (): Channel[] => {
		return chats.filter((chat) => {
			if (chat.name === 'private' && chat.members.length === 2) {
				const otherMember = chat.members.find((member) => member.id !== userCtx.user?.id);
				if (otherMember) {
					const isBlocked = checkIsBlocked(otherMember.id);
				return !isBlocked;
				}
			}
			return true;
		});
	};  
	
	const handleJoinGroup = useCallback((channelId: number, userId: number) => {
		// setChats(chats => chats.filter(chat => chat.id !== id));
		socket?.emit('handleJoinGroup', { channelId: channelId, userId: userId });
		
	}, [socket])

	const handleJoinLink = useCallback(async (joinData: JoinChannelDTO): Promise<JoinResponse> => {

		try {
			const response: Response = await fetch(`http://localhost:3000/channels/${joinData.channelId}/join`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + userCtx.logInfo?.token,
			},
			body: JSON.stringify(joinData)
			});

			if (response?.status === 404) {
				// console.log("It appears that this channels does not exist anymore or link has expired!");
				return { status: 404, error: "It appears that this channels does not exist anymore or link has expired!" };
			}

			if (response?.status === 400) {
				// console.log("It appears that you have already joined this group!");
				return { status: 404, error: "It appears that you have already joined this group!" };
			}

			if (response?.status === 403) {
				// console.log("You have been banned from this group.");
				return { status: 403, error: "You have been banned from this group." };
			}

			if (response?.status === 401) {
				// console.log("Wrong password provided!");
				return { status: 401, error: "Wrong password provided" };
			}

			if (!response.ok) {
				return { status: response.status, error: "An error occurred" };
			}

			await fetchChannels();
			setSelectedConversation(chats.find(chat => chat.id === joinData.channelId));
			handleJoinGroup(joinData.channelId, joinData.userId);
			return { status: response.status };
			
		} catch (error) {
		  console.log(error);

		}
		return { status: 200 };
	}, [fetchChannels, chats, handleJoinGroup, userCtx.logInfo?.token]);
	
	const joinListener = useCallback((channelId: string) => {
		// console.log('client joined channel ', channelId);
		socket?.emit('join', parseInt(channelId, 10));
		fetchChannels();
	  }, [fetchChannels, socket]);

	const kickListener = useCallback(async (channelId: string) => {
		// console.log('client was kicked from channel ', channelId);
		if (selectedConversation && +channelId === selectedConversation.id) {
			setSelectedConversation(undefined);
		}
		setChats(prevChats => prevChats.filter(chat => chat.id !== +channelId));

	}, [selectedConversation]);
	
	const userJoinedListener = useCallback((data : {
			channelId: number, 
			updatedMembers: UserAPI[]}) => {
		fetchChannels();
	}, [fetchChannels]);

	useEffect(() => {
		socket?.on('userJoined', userJoinedListener)
	
		return () => {
		  socket?.off('userJoined');
		}
	  }, [socket, userJoinedListener]);

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

	const removeMemberListener = useCallback(
		async (data: { channelId: number, userId: number }) => {
			// console.log('Channel that you belong to removed this member: ', data.userId);
	
			setChats((prevChats: Channel[]) => {
			return prevChats.map(chat => {
				if (chat.id === data.channelId) {
				const members = chat.members;
				if (members) {
					const updatedMembers = members.filter(member => member.id !== data.userId);
					const updatedChat: Channel = {
					...chat,
					members: updatedMembers
					};
					return updatedChat;
				}
				return chat;
				} else {
				return chat;
				}
			});
		});
	}, []);

	useEffect(() => {
		socket?.on("handleKick", kickListener);
		socket?.on("handleRemoveMember", removeMemberListener);
		return () => {
		  socket?.off("handleKick", kickListener);
		  socket?.off("handleRemoveMember", removeMemberListener);
		}
	}, [socket, kickListener, removeMemberListener]);

	const addAdminListener = useCallback(
		async (data: { channelId: number, userId: number }) => {
		// console.log('Channel that you belong to has a new admin: ', data.userId);

		const newAdmin = await userCtx.fetchUserById(data.userId);
		setChats((prevChats: Channel[]) => {
		return prevChats.map(chat => {
			if (chat.id === data.channelId) {
			const admins = chat.admins;
			if (admins && newAdmin !== undefined)
			{
				const updatedChat: Channel = {
					...chat,
					admins: [...admins, newAdmin]
				};
				return updatedChat;
			}
			return chat;
			} else {
			return chat;
			}
		});
		});
	}, [userCtx]);

	useEffect(() => {
		socket?.on("handleAddAdmin", addAdminListener);
		return () => {
		  socket?.off("handleAddAdmin", addAdminListener);
		}
	}, [socket, addAdminListener]);

	const removeAdminListener = useCallback(
	async (data: { channelId: number, userId: number }) => {
		// console.log('Channel that you belong to removed this admin: ', data.userId);

		setChats((prevChats: Channel[]) => {
		return prevChats.map(chat => {
			if (chat.id === data.channelId) {
			const admins = chat.admins;
			if (admins) {
				const updatedAdmins = admins.filter(admin => admin.id !== data.userId);
				const updatedChat: Channel = {
				...chat,
				admins: updatedAdmins
				};
				return updatedChat;
			}
			return chat;
			} else {
			return chat;
			}
		});
		});
	}, []);	  

	useEffect(() => {
		socket?.on("handleRemoveAdmin", removeAdminListener);
		return () => {
		  socket?.off("handleRemoveAdmin", removeAdminListener);
		}
	}, [socket, removeAdminListener]);

	const addMutedListener = useCallback(
		async (data: { channelId: number, userId: number }) => {
		// console.log('Channel that you belong to has a new muted: ', data.userId);

		const newMuted = await userCtx.fetchUserById(data.userId);
		setChats((prevChats: Channel[]) => {
		return prevChats.map(chat => {
			if (chat.id === data.channelId) {
			const muted = chat.muted;
			if (muted && newMuted !== undefined)
			{
				const updatedChat: Channel = {
					...chat,
					muted: [...muted, newMuted]
				};
				return updatedChat;
			}
			return chat;
			} else {
			return chat;
			}
		});
		});
	}, [userCtx]);

	useEffect(() => {
		socket?.on("handleAddMuted", addMutedListener);
		return () => {
		  socket?.off("handleAddMuted", addMutedListener);
		}
	}, [socket, addMutedListener]);

	const removeMutedListener = useCallback(
	async (data: { channelId: number, userId: number }) => {
		// console.log('Channel that you belong to removed this admin: ', data.userId);

		setChats((prevChats: Channel[]) => {
		return prevChats.map(chat => {
			if (chat.id === data.channelId) {
			const muted = chat.muted;
			if (muted) {
				const updatedMuted = muted.filter(mute => mute.id !== data.userId);
				const updatedChat: Channel = {
				...chat,
				muted: updatedMuted
				};
				return updatedChat;
			}
			return chat;
			} else {
			return chat;
			}
		});
		});
	}, []);
	  
	useEffect(() => {
		socket?.on("handleRemoveMuted", removeMutedListener);
		return () => {
		  socket?.off("handleRemoveMuted", removeMutedListener);
		}
	}, [socket, removeMutedListener]);

	useEffect(() => {
		socket?.on('chatDeleted', (data) => {
			if (chats.find(chat => chat.id === data.chatId)) {
				setChats(chats => chats.filter(chat => chat.id !== data.chatId));
			}
			setSelectedConversation(undefined);
		});
	
		return () => {
			socket?.off('chatDeleted');
		};
	}, [chats, socket]);

	const handleCreateGroup = (channel: Channel) => {

		for (const member of channel.members)
		{
			const data = {
				receiverId: member.id,
				channelId: channel.id,
			};

			// console.log(member);
			socket?.emit("createJoin", data);
		}

	}

	const handleChatDeletion = useCallback((id: number) => {
		setChats(chats => chats.filter(chat => chat.id !== id));
		setSelectedConversation(undefined);
		socket?.emit('chatDeleted', { chatId: id, userId: userCtx.user?.id });
	}, [socket, userCtx.user?.id]);

	const handleKick = useCallback((channelId: number, kickedId: number) => {
		// setChats(chats => chats.filter(chat => chat.id !== id));
		socket?.emit('kickUser', { channelId: channelId, userId: kickedId });
	}, [socket])

	const handleAddAdmin = useCallback((channelId: number, userId: number) => {
		// setChats(chats => chats.filter(chat => chat.id !== id));
		socket?.emit('addAdmin', { channelId: channelId, userId: userId });
	}, [socket])

	const handleRemoveAdmin = useCallback((channelId: number, userId: number) => {
		// setChats(chats => chats.filter(chat => chat.id !== id));
		socket?.emit('removeAdmin', { channelId: channelId, userId: userId });
	}, [socket])

	const handleAddMuted = useCallback((channelId: number, userId: number) => {
		socket?.emit('addMuted', { channelId: channelId, userId: userId });
	}, [socket])

	const handleRemoveMuted = useCallback((channelId: number, userId: number) => {
		socket?.emit('removeMuted', { channelId: channelId, userId: userId });
	}, [socket])

	const checkLastMessageDeleted = useCallback((message: MessageAPI) => {
		const chatMessage = chats.find(chat => chat.id === message.channelId);

		if (chatMessage?.messages.length === 0)
		{
			deleteChat(chatMessage);
			handleChatDeletion(chatMessage.id);
		}
	}, [chats, handleChatDeletion])

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
	}, [chats, socket, checkLastMessageDeleted]);
	  
	useEffect(() => {
		const newSocket = io("http://localhost:3000/chat");
		setSocket(newSocket);
		newSocket.on('connect', () => {
		  newSocket.emit('user_connected', userCtx.user?.id, userCtx.logInfo?.token);
		});
	  
		return () => {
		  newSocket.removeAllListeners();
		}
	}, [setSocket, userCtx.user?.id, userCtx.logInfo?.token]);

	const handleMessageDeletion = (message: MessageAPI) => {
		// console.log('about to delete: ', message.content);
		socket?.emit('messageDeleted', { message: message })
	}
	
	useEffect(() => {
		fetchChannels();
	}, [fetchChannels]);

	useEffect(() => {
		if(socket && chats.length > 0) {
			chats.forEach(chat => {
				socket.emit('join', chat.id);
			});
		}
	}, [socket, chats]);

	const onSaveConversation = useCallback((channel: Channel) => {
		setSelectedConversation(channel);
		socket?.emit('join', channel.id);
	}, [socket])

	useEffect(() => {
		let selectedChannel = chats.find(chat => chat.id === selectedConversation?.id);
		if (selectedChannel)
			setMessages(selectedChannel.messages);
	}, [selectedConversation, chats]);

	const checkPreviousPage = useCallback(() => {

		if (state) {

			const user = state;
			const chatExist = chats.find(chat =>
				chat.name === 'private' && chat.members.some(member => member.id === user.id));
	
			if (chatExist)
				onSaveConversation(chatExist);
			else if (userCtx.user)
			{
				const newChat = {
						createdAt: new Date(),
						creatorId: userCtx.user?.id,
						id: -1,
						name: 'private',
						messages: [],
						members: [user, userCtx.user]
					}
				setChats([...chats, newChat]);
				onSaveConversation(newChat);

			}
		}
	}, [chats, state, onSaveConversation, userCtx.user])

	useEffect(() => {
		if (chats) {
			checkPreviousPage();
		}
	}, [chats, checkPreviousPage]);

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
				< ManageChats 
					onCreate={handleCreateGroup}/>
				{
					chats && chats.length > 0 ?
					filteredChats().map((chat) => (
						<ChatOverview key={chat.id}
						chats={chats}
						chat={chat}
						isSelected={chat.id === selectedConversation?.id ? true : false}
						onSaveConversation={onSaveConversation}
						onDeleteChat={handleChatDeletion}
						onKick={handleKick}
						onAddAdmin={handleAddAdmin}
						onRemoveAdmin={handleRemoveAdmin}
						onAddMuted={handleAddMuted}
						onRemoveMuted={handleRemoveMuted}
						/>
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
					msgs={messages}
					chats={chats}
					onDelete={handleMessageDeletion}
					onJoin={handleJoinLink}/>
				: <NoConvo/>
			}
		</div>
	)
}
import { useContext, useEffect, useRef, useState } from 'react';
import ChatInfo from '../components/Chat/ChatInfo';
import classes from '../sass/pages/Chat.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import Message from '../components/Chat/Message';
import NoConvo from '../components/Chat/NoConvo';
import io from 'socket.io-client';


// GET http://localhost:3000/channels/userId/1
// [
//     {
//         "id": 1,
//         "name": "private",
//         "messages": [
//             {
//                 "createdAt": "2023-06-12T09:16:21.758Z",
//                 "id": 1,
//                 "senderId": 1,
//                 "content": "Hey girl",
//                 "channelId": 1
//             }
//         ],
//         "members": [
//             {
//                 "id": 1,
//                 "channelId": 1,
//                 "userId": 1
//             },
//             {
//                 "id": 2,
//                 "channelId": 1,
//                 "userId": 2
//             }
//         ]
//     }
// ]

const socket = io('http://localhost:3000/chat', {
		transports: ["websocket"],
		}
	);

export interface Message {
	createdAt: Date,
	id: number,
	senderId: number,
	// sender: UserAPI,
	content: string,
	channelId: number,
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
	
	const [ selectedConversationId, setSelectedConversationId ] = useState<number>(0);
	const [ selectedConversation, setSelectedConversation ] = useState<Channel | null>();
	const messageInput = useRef<HTMLInputElement>(null);
	const userCtx = useContext(UserContext);
	const [chats, setChats] = useState<Channel[]>([]);

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
	}
	
	const displayConvo = (chatList: Channel[], channelId: number) => {

		const isMessageMine = (message: Message) => {
			if (message.senderId === userCtx.user?.id)
				return true;
			return false;
		}

		const isMessageLast = (message: Message, messages: Message[]) => {
			
			const messageIndex = messages.findIndex(m => m.id === message.id);

			if (messageIndex === messages.length - 1
				|| messages[messageIndex + 1].senderId !== message.senderId)
				return true;
			return false;
		}
			
		
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

		if (selectedConversationId === 0)
			return <NoConvo/>;
		return (
			<div className={classes.message}>
				{
					selectedConversation?.messages.map((message) => 
						<Message key={message.id}
								isMine={isMessageMine(message)}
								isLast={isMessageLast(message, selectedConversation?.messages)} 
								message={message.content}/>)
				}

				<form onSubmit={handleSubmit}>
					<input className={classes.sendInput} type="text" ref={messageInput} placeholder='type here...' />
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
				displayConvo(chats, selectedConversationId)
			}
		</div>
	)
}
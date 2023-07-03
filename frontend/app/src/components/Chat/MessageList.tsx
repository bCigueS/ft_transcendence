
import Message from "./Message";
import classes from './../../sass/pages/Chat.module.scss';
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../store/users-contexte";
import { Channel, JoinChannelDTO, MessageAPI, isMemberMuted } from "./chatUtils";

type JoinResponse = {
	status: number;
	error?: string;
  };

const MessageList: React.FC<{send: (content: string, channelId: number) => {}, chat: Channel, chats: Channel[], msgs: MessageAPI[], onDelete: (message: MessageAPI) => void, onJoin: (joinData: JoinChannelDTO) => Promise<JoinResponse>}> = ({ send, chat, chats, msgs, onDelete, onJoin }) => {

    const [ messages, setMessages ] = useState<MessageAPI[]>(chat.messages);
    const [ isMuted, setIsMuted ] = useState(false);
	const messageInput = useRef<HTMLInputElement>(null);
	const userCtx = useContext(UserContext);

	const lastMessageRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const lastMessageElement = lastMessageRef.current;
		if (lastMessageElement) {
		  lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	}, []);

	useEffect(() => {
		setMessages(msgs);
	  }, [msgs]);

	useEffect(() => {
		const fetchUserMuteStatus = async () => {
			if(userCtx.user?.id && chat.name !== "private") {
				const userIsMuted = await isMemberMuted(chat.id, userCtx.user?.id);
				setIsMuted(userIsMuted);
			}
		}
		// setMessages(chat.messages);
		fetchUserMuteStatus();
	}, [chat, chats, msgs, userCtx.user?.id]);
    
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
		if (messageIndex === 0)
			return true;
		
		const date = new Date(message.createdAt);
		const prevDate = new Date(messages[messageIndex - 1].createdAt);
		if (prevDate.toDateString() !== date.toDateString())
			return true;
		return false;
	}

    const handleSubmit = (event: { preventDefault: () => void; }) => {
		event.preventDefault();
        const enteredText = messageInput.current!.value;
		
        if (enteredText.trim().length === 0) {
			return ;
        }
		// console.log('in handle submit to send message');
		send(enteredText, chat.id);
        messageInput.current!.value = '';
    }

	const reversedMessageList = () => {
		// console.log('messages: ', messages);
		// console.log('reversed messages: ', messages.slice().reverse());
		return messages.slice().reverse();
	}

    return (
        <>
            <div className={classes.message}>
                { messages && 
                    reversedMessageList().map((message) => 
                    <Message
						key={message.id}
						isMine={isMine(message)}
						isLast={isLast(message)}
						displayDay={displayDay(message)}
						message={message}
						messages={messages}
						onDelete={onDelete}
						chat={chat}
						onJoin={onJoin}/>)
                }
            </div>
            <form  onSubmit={handleSubmit} className={classes.input}>
				{
					!isMuted ?
					<input className={classes.sendInput} 
						type="text"
						ref={messageInput}
						placeholder='type here...'
						maxLength={150} />
					:
					<input className={classes.sendInput} 
						type="text"
						ref={messageInput}
						placeholder='You are not authorized to talk in this channel 🫢'
						maxLength={150}
						disabled/>
				}
					<div ref={lastMessageRef}></div>
            </form>
        </>
    );
}

export default MessageList;

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
        setMessages(chat.messages);
    }, [chat, chats, msgs]);
    
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
			// return false;
		// return (true);

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

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const enteredText = messageInput.current!.value;

        if (enteredText.trim().length === 0) {
            return ;
        }

		let userIsMuted = false;
		if (userCtx.user?.id && chat.name !== "private")
			userIsMuted = await isMemberMuted(chat.id, userCtx.user?.id);
		if (!userIsMuted)
		{
        	send(enteredText, chat.id);
		}
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
                <input className={classes.sendInput} 
                        type="text"
                        ref={messageInput}
                        placeholder='type here...' />
            <div ref={lastMessageRef}></div>
            </form>
        </>
    );
}

export default MessageList;
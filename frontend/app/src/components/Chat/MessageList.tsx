
import Message from "./Message";
import classes from './../../sass/pages/Chat.module.scss';
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../store/users-contexte";
import { Channel, MessageAPI } from "./chatUtils";

const MessageList: React.FC<{send: (content: string, channelId: number) => {}, chat: Channel, chats: Channel[], onDelete: (message: MessageAPI) => void}> = ({ send, chat, chats, onDelete }) => {

    const [ messages, setMessages ] = useState<MessageAPI[]>(chat.messages);
	const messageInput = useRef<HTMLInputElement>(null);
	const userCtx = useContext(UserContext);

    useEffect(() => {
        setMessages(chat.messages);
    }, [chat, chats]);
    
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
        send(enteredText, chat.id);
        messageInput.current!.value = '';
    }

    return (
        <div className={classes.message}>
			{ messages && 
				messages.map((message) => 
					<Message key={message.id}
							isMine={isMine(message)}
							isLast={isLast(message)}
							displayDay={displayDay(message)}
							message={message}
							messages={messages}
							onDelete={onDelete}/>)
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

export default MessageList;
import { Fragment, useContext, useEffect, useState } from "react";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';
import ProfilIcon from "../Profile/ProfilIcon";
import { UserAPI, UserContext } from "../../store/users-contexte";
import Modal from "../UI/Modal";
import { Channel, MessageAPI, deleteChat } from "./chatUtils";

// const Searchbar: React.FC<{onSaveSearch: (input: string) => void}> = ( props ) => {

const ChatInfo: React.FC<{chats: Channel[], chat: Channel, isSelected: boolean, onSaveConversation: (channel: Channel) => void,
onDeleteChat: (channelId: number) => void}> 
	= ( props ) => {

	const [sender, setSender] = useState<UserAPI | null>(null);
	const [lastMessage, setLastMessage] = useState<MessageAPI | null>(null);
	const [ showModal, setShowModal ] = useState(false);
	const [ conversation, setConversation ] = useState<number>(0);
	const userCtx = useContext(UserContext);

	const conversationHandler = () => {
		setConversation(props.chat.id)
		props.onSaveConversation(props.chat);
	}

	const getSender = () => {
		if (props.chat.members && props.chat.name === "private")
		{
			props.chat.members.forEach((member) => {
				if (member.id !== userCtx.user?.id)
					setSender(member);
			})
		}
	}

	const getLastMessage = () => {
		const messages = props.chat.messages;
		let latestMessage = null;
		if (messages && messages.length > 0) {
			latestMessage = messages.reduce((latest, current) => {
				return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
			}, messages[0]);
		}
		setLastMessage(latestMessage);
	}
	
	useEffect(() => {
		getSender();
		getLastMessage();
	}, [conversation, props.chats]);

		
	const handleClickDelete = () => {
		setShowModal(true);
	}
	
	const handleUserConfirmation = () => {
		setShowModal(false);
	}
	
	const handleDeleteChat = () => {
		deleteChat(props.chat);
		props.onDeleteChat(props.chat.id);
		setShowModal(false);
	}

	return (
		<Fragment>
		{showModal &&
			<Modal
				title="About to delete chat"
				message="Do you really wish to delete this chat?"
				onCloseClick={handleUserConfirmation}
				onDelete={handleDeleteChat}
			/>
		}
		<div className={`${classes.container} ${props.isSelected ? classes.selected : ''}`}>
			<div className={classes.picture}>
			<ProfilIcon user={sender} displayCo={false} size={["4rem", "4rem"]} />
			</div>
			<div className={classes.info} onClick={conversationHandler}>
				<p className={classes.name}>
					{ sender && sender?.name}
				</p>
				{ props.chat.messages && 
					props.chat.messages.length > 0 ? 
					<p className={classes.lastMessage}>
						{lastMessage?.content}
					</p> 
					:
					<p className={classes.lastMessage} style={{fontStyle: 'italic'}}>
						draft...
					</p>
				}
			</div>
			<div className={classes.delete} onClick={handleClickDelete}>
				<svg width="10px" height="10px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" /> </svg>
			</div>
		</div>
		</Fragment>
	)
}

export default ChatInfo;
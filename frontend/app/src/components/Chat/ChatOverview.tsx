import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import classes from '../../sass/components/Chat/ChatOverview.module.scss';
import ProfilIcon from "../Profile/ProfilIcon";
import { UserAPI, UserContext } from "../../store/users-contexte";
import { Channel, MessageAPI, deleteChat } from "./chatUtils";
import GroupIcon from "./GroupIcon";
import ChatInfo from "./ChatInfo";

// const Searchbar: React.FC<{onSaveSearch: (input: string) => void}> = ( props ) => {

const ChatOverview: React.FC<{chats: Channel[], chat: Channel, isSelected: boolean, onSaveConversation: (channel: Channel) => void,
onDeleteChat: (channelId: number) => void, onKick: (channelId: number, kickedId: number) => void}> 
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

	const getSender = useCallback(() => {
		if (props.chat.members && props.chat.name === "private")
		{
			props.chat.members.forEach((member) => {
				if (member.id !== userCtx.user?.id)
					setSender(member);
			})
		}
	}, [props.chat.members, props.chat.name, userCtx.user?.id])

	const getLastMessage = useCallback(() => {
		const messages = props.chat.messages;
		let latestMessage = null;
		if (messages && messages.length > 0) {
			latestMessage = messages.reduce((latest, current) => {
				return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
			}, messages[0]);
		}
		setLastMessage(latestMessage);
	}, [props.chat.messages])
	
	useEffect(() => {
		getSender();
		getLastMessage();
	}, [conversation, props.chats, getLastMessage, getSender]);


	const handleUserConfirmation = () => {
		setShowModal(false);
	}
	
	const handleDeleteChat = () => {
		deleteChat(props.chat);
		props.onDeleteChat(props.chat.id);
		setShowModal(false);
	}

	const handleClickInfo = () => {
		setShowModal(true);
	}

	return (
		<Fragment>
		{showModal &&
			<ChatInfo
				chat={props.chat}
				onInfoClick={handleUserConfirmation}
				onDelete={handleDeleteChat}
				onKick={props.onKick}
			/>
		}
		<div className={`${classes.container} ${props.isSelected ? classes.selected : ''}`}>
				<div className={classes.picture}>
					{
						props.chat.name === "private" ?
						<ProfilIcon user={sender} displayCo={false} size={["4rem", "4rem"]} />
						:
						<GroupIcon chat={props.chat} displayCo={false} size={["4rem", "4rem"]}/>
					}
				</div>
				<div className={classes.info} onClick={conversationHandler}>
					<p className={classes.name}>
						{ sender ? sender?.name : props.chat.name}
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
				<div className={classes.chatInfo} onClick={handleClickInfo}>
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
						<path fill="currentColor" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
					</svg>
				</div>
		</div>
		</Fragment>
	)
}

export default ChatOverview;
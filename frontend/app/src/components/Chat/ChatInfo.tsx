import { useContext, useEffect, useState } from "react";
import { ChatAPI as Chat } from "../../pages/Chat";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';
import ProfilIcon from "../Profile/ProfilIcon";
import { UserAPI, UserContext } from "../../store/users-contexte";

// const Searchbar: React.FC<{onSaveSearch: (input: string) => void}> = ( props ) => {

const ChatInfo: React.FC<{chat: Chat, onSaveConversation: (channelId: number) => void}> = ( props ) => {

	const [loading, setLoading] = useState<boolean>(false);
	const [sender, setSender] = useState<UserAPI | null>(null);
	const [ conversation, setConversation ] = useState<number>(0);
	const userCtx = useContext(UserContext);

	const conversationHandler = () => {
		setConversation(props.chat.id)
	}

	const fetchSender = async() => {

		setLoading(true);
		const response = await fetch('http://localhost:3000/users/' + props.chat.senderId);
		const data = await response.json();

		if (!response.ok)
			throw new Error('Failed to fetch user with id ' + props.chat.senderId);
		
		const userFound = {
			id: data.id,
			email: data.email,
			name: data.name,
			avatar: data.avatar,
			doubleAuth: data.doubleAuth,
			wins: data.wins
		}
		setSender(userFound);
		setLoading(false);
		
	}
	useEffect(() => {
		// const user: UserAPI | null = userCtx.fetchUserById(props.chat.senderId);
		// setSender(user);
		fetchSender();
		props.onSaveConversation(conversation);
	}, [conversation]);
	
	if (!loading)
		console.log(sender);
	console.log('convo id: ', conversation);


	return (
		<div className={classes.container}>
			<div className={classes.picture}>

			<ProfilIcon user={sender} displayCo={false} size={["4rem", "4rem"]} />
			</div>
			<div className={classes.info} onClick={conversationHandler}>
				<p className={classes.name}>
					{/* {props.chat.senderId}	 */}
					{ !loading && sender?.name}
				</p>
				<p className={classes.lastMessage}>
					{props.chat.lastMessage}
				</p> 
			</div>
		</div>
	)
}

export default ChatInfo;
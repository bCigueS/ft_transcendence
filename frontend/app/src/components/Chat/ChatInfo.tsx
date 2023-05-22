import { useContext } from "react";
import { ChatAPI as Chat } from "../../pages/Chat";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';
import ProfilIcon from "../Profile/ProfilIcon";
import { UserAPI, UserContext } from "../../store/users-contexte";


const ChatInfo: React.FC<{chat: Chat}> = ({ chat }) => {

	const userCtx = useContext(UserContext);
	

	const formattedMessage = (message: string) => {
		
		if (message.length > 8)
			return message.substring(0, 8).concat("...");
		return message;
	}


	return (
		<div className={classes.container}>
			<ProfilIcon user={userCtx.user} displayCo={false} size={["4rem", "4rem"]} />
			<div className={classes.info}>
				<p className={classes.name}>
					{/* {chat.senderId}	 */}
					name
				</p>
				<p className={classes.lastMessage}>
					{/* lastMessage */}
					{chat.lastMessage}	
					{/* {formattedMessage(chat.lastMessage)}	 */}
				</p> 
			</div>
		</div>
	)
}

export default ChatInfo;
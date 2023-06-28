import { useContext, useEffect, useState } from 'react';

import classes from '../../sass/components/Chat/Message.module.scss';
import { UserAPI, UserContext } from '../../store/users-contexte';
import Modal from '../UI/Modal';
import { Channel, JoinChannelDTO, MessageAPI, fetchChannelById } from './chatUtils';
import ProfilIcon from '../Profile/ProfilIcon';
import JoinModal from './JoinModal';
import ErrorModal from './ErrorModal';

type JoinResponse = {
	status: number;
	error?: string;
  };

const Message: React.FC<{ isMine: boolean, isLast: boolean, displayDay: boolean, 
					message: MessageAPI, messages: MessageAPI[], 
					onDelete: (message: MessageAPI) => void,
					chat: Channel,
					onJoin: (joinData: JoinChannelDTO) => Promise<JoinResponse>}> = ( { isMine, isLast, displayDay, message, messages, onDelete, chat, onJoin } ) => {

	const [ isHovering, setIsHovering ] = useState(false);
	const [ showModal, setShowModal ] = useState(false);
	const [ sender, setSender ] = useState<UserAPI | null>(null);
	const [ channel, setChannel ] = useState<Channel | null>(null);
	const [ joinError, setJoinError ] = useState(false);
	const [ errorType, setErrorType ] = useState('');
	const [ joinWithPassword, setJoinWithPassword ] = useState(false);
	 
	const userCtx = useContext(UserContext);

	const date = new Date(message.createdAt);

	const whichBubble = () => {
		if (isMine && isLast)
			return classes.myLastBubble;
		else if (isMine)
			return classes.myBubble;
		else if (!isMine && isLast)
			return classes.yourLastBubble;
		else
			return classes.yourBubble;
	}

	const handleMouseOver = () =>
	{
		setIsHovering(true);
	}

	const handleMouseOut = () =>
	{
		setIsHovering(false);
	}

	const deleteMessage = async () => {
		try {
			const response = await fetch('http://localhost:3000/messages/' + message.id, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		
			if (response.status === 404) {
				throw new Error("Failed to delete message!") ;
			}


			if (!response.ok)
				throw new Error("Failed to delete message!") ;

			
		} catch (error: any) {
			console.log(error.message);
		}

		// if last message delete channel
		
	};

	const displaySender = async () => {
		let sender = null;
		if (message.senderId)
			sender = await userCtx.fetchUserById(message.senderId);
		if (sender)
		{
			setSender(sender);
		}
	}

	useEffect(() => {
		displaySender();
	});

	const handleDeletion = () => 
	{
		deleteMessage();
		onDelete(message);
		setShowModal(false);
	}

	const handleClickDelete = () => {
		setShowModal(true);
	}

	const handleUserConfirmation = () => {
		setShowModal(false);
	}

	const handleUserJoinError = () => {
		setJoinError(false);
	}

	const handleUserJoinWithPassword = () => {
		setJoinWithPassword(false);
	}

	const handleClickJoin = async (channelId: number) => {
		const channel = await fetchChannelById(channelId);
		setChannel(channel);

		if (!channel)
		{
			setJoinError(true);
			setErrorType('It appears that this channel does not exist anymore or the link has expired.')
			return ;
		}

		if (!userCtx.user?.id)
			return ;

		let joinData: JoinChannelDTO = {
			channelId: channelId,
			userId: userCtx.user?.id,
		}
		
		if (channel?.isPasswordProtected)
		{
			setJoinWithPassword(true);
			return ;
		}

		try {
			console.log('about to call handleJoinLink when its not password protected');
			const response: JoinResponse = await onJoin(joinData);

			if (response.status !== 200 && response.error) {
				setJoinError(true);
				setErrorType(response.error);
				return ;
			}
		  
		  } catch (error) {
			console.error(error);
		  }
		
	}


	const displayMessage = () => {

		if (message.content.includes('join/')) {
			const channelId = message.content.split('_')[1];
			return (
				<div className={classes.link}>
					You've been invited to join a group 👇 <br></br>
					<a href="#" onClick={() => handleClickJoin(+channelId)}>
						{message.content}
					</a>
				</div>
		);
	} else {
		return (
			<p>{message.content}</p>
			);
		}
	}
		

	return (
		<>
		{showModal &&
			<Modal
				title="About to delete message"
				message="Do you really wish to delete this message?"
				onCloseClick={handleUserConfirmation}
				onDelete={handleDeletion}
			/>
		}
		{joinError &&
			<ErrorModal
				title="Error Joining this channel"
				message={errorType}
				onCloseClick={handleUserJoinError}
			/>
		}

		{joinWithPassword &&
			<JoinModal
				title="About to join channel"
				message="You need to provide a password to enter that channel."
				channel={channel}
				onConfirm={onJoin}
				onCloseClick={handleUserJoinWithPassword}
			/>
		}
		{ displayDay && <div className={classes.date}>{message && date.toDateString()}</div> }
		<div className={whichBubble()} 
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}>
			<div 
				className={isMine ? classes.myMessage : classes.yourMessage}>
				<div className={classes.sender}>
				{ sender && sender.id !== userCtx.user?.id && chat.name !== "private" && sender?.name}
				</div>
				{ displayMessage() }
			{ isHovering && 
				<div className={classes.info}>
					<div className={classes.hour}>
					{date.getHours().toString()}
					:
					{date.getMinutes().toString() + ' '} 
					</div>
					{
						isMine &&
						<div className={classes.delete} onClick={handleClickDelete}>
						<svg width="1rem" height="1rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" /> </svg>
						</div>
					}
				</div>
			}
			</div>
			
		</div>
		{
			sender && sender.id !== userCtx.user?.id && isLast ?
			<div className={classes.senderProfile}>
			<ProfilIcon user={sender} displayCo={false} size={["2.5rem", "2.5rem"]}/>
			</div>
			:
			<div></div>
		}
		</>
	)
}

export default Message;
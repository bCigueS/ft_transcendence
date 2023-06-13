import React, { useCallback, useContext, useEffect, useState } from 'react';

import classes from '../../sass/components/Chat/Message.module.scss';
import { UserContext } from '../../store/users-contexte';
import { MessageAPI } from '../../pages/Chat';


const Message: React.FC<{ isMine: boolean, isLast: boolean, displayDay: boolean, 
					message: MessageAPI, messages: MessageAPI[], 
					onDelete: (message: MessageAPI) => void }> = ( { isMine, isLast, displayDay, message, messages, onDelete } ) => {

	const [ isHovering, setIsHovering ] = useState(false);
	const [ isDeleted, setIsDeleted ] = useState(false);


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

	const handleClickDelete = () => 
	{
		onDelete(message);
	}

	return (
		
		<>
		{ displayDay && <div className={classes.date}>{message.createdAt.toDateString()}</div> }
		<div className={whichBubble()} 
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}>
			<div 
				className={isMine ? classes.myMessage : classes.yourMessage}>
				{ message.content }
			{ isHovering && 
				<div className={classes.info}>
					<div className={classes.hour}>
					{message.createdAt.getHours().toString()}
					:
					{message.createdAt.getMinutes().toString() + ' '} 
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
		</>
	)
}

export default Message;
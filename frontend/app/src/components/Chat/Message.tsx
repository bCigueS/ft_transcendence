import React, { useEffect, useState } from 'react';

import classes from '../../sass/components/Chat/Message.module.scss';

const Message: React.FC<{ isMine: boolean, isLast: boolean, message: string }> = ( { isMine, isLast, message } ) => {

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

	return (
		
		<div className={whichBubble()}>
			<div 
				className={isMine ? classes.myMessage : classes.yourMessage}>
				{ message }
			</div>
		</div>
	)
}

export default Message;
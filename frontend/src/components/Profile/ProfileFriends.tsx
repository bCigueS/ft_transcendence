import React, { useState } from 'react';

import { User } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfileFriends.module.scss';

const ProfileFriends: React.FC<{friend: User}> = ( props ) => {


	const [isBlock, setIsBlock] = useState(false);
	const isConnected = true;

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		setIsBlock(!isBlock);
	}


	return (
		<div className={classes.container}>
			<div 
				className={classes.picture}>
				<i 
					className="fa-solid fa-circle" 
					style={{color: isConnected ? 'green' : 'red' }
					}>
				</i>
			</div>
			<div className={classes.info}>
				<h1>{props.friend.nickname}</h1>
				<i className='fa-solid fa-message'>	</i>

			</div>
			<div className={classes.option}>
				<i 
					title="Block"
					onClick={addBlockHandler}
					className={isBlock ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'}>
				</i>
				<i className='fa-solid fa-user-minus'></i>
			</div>
		</div>
	)
}

export default ProfileFriends;
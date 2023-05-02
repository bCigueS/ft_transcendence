import React, { useContext } from 'react';

import { User, UserContext } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfileFriends.module.scss';
import ProfilIcon from './ProfilIcon';

const ProfileFriends: React.FC<{user: User; block: boolean; friend: boolean}> = ( props ) => {

	const userCtx = useContext(UserContext);

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.blockUser(props.user);
	};

	const removeBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.unblockUser(props.user);
	};

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.unfriendUser(props.user);
	}

	return (
		<div className={classes.container}>

			<ProfilIcon user={props.user} />

			<div className={classes.info}>
				<h1>{props.user.nickname}</h1>
				<i 
					title='Private Message'
					className='fa-solid fa-message'>
				</i>

			</div>

			<div className={classes.option}>
				<i 
					title={props.block ? "Unblock" : "Block"}
					onClick={props.block ? removeBlockHandler : addBlockHandler}
					className={props.block ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'}>
				</i>
				<i 
					title='Friend'
					onClick={removeFriendHandler}
					className={props.friend ? 'fa-solid fa-user-minus' : 'fa-solid fa-user-plus'}>
				</i>
			</div>
		</div>
	)
}

export default ProfileFriends;
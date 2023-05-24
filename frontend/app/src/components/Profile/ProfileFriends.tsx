import React, { useContext } from 'react';

import { UserAPI, UserContext } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfileFriends.module.scss';
import ProfilIcon from './ProfilIcon';

const ProfileFriends: React.FC<{user: UserAPI; block: boolean; friend: boolean}> = ( props ) => {

	const userCtx = useContext(UserContext);

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchBlockUser(props.user);
	};

	const removeBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchUnblockUser(props.user);
	};

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchRemoveFriend(props.user);
	}

	return (
		<div className={classes.container}>

			<ProfilIcon user={props.user} />

			<div className={classes.info}>
				<h1>{props.user?.name}</h1>
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
import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { User, UserContext } from '../../store/users-contexte';

const LeaderboardProfil: React.FC<{user: User}> = ( { user }) => {

	const userCtx = useContext(UserContext);

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.unfriendUser(user);
	}

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.friendUser(user);
	}

	const friendIconDisplay = (user: User) => {
		if (userCtx.user.friends.includes(user)) {
			return (<i 
						className='fa-solid fa-user-minus'
						onClick={removeFriendHandler}
					></i>);
		}
		else if (!userCtx.user.friends.includes(user) && user !== userCtx.user) {
			return (<i 
						className='fa-solid fa-user-plus'
						onClick={addFriendHandler}
					></i>);
		}
	}

	return (
		<div className={classes.container}>
			<ProfilIcon user={user}/>
			<p>{user.nickname}</p>
			<div className={classes.icon}>
				<i className='fa-solid fa-trophy'>: {user.wins}</i>
				<i className='fa-solid fa-bolt'>: {user.lose}</i>
				<i className='fa-solid fa-message'></i>
				{user === userCtx.user ? 
					<i className='fa-solid fa-user'></i> :
					friendIconDisplay(user)}
				<i className='fa-solid fa-table-tennis-paddle-ball'></i>
			</div>
		</div>
	)
}

export default LeaderboardProfil;
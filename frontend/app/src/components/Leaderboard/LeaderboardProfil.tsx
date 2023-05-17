import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { User, UserAPI, UserContext } from '../../store/users-contexte';
import { async } from 'q';

const LeaderboardProfil: React.FC<{user: UserAPI}> = ( { user }) => {
	

	const userCtx = useContext(UserContext);

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
	}

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
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
			<p>{user.name}</p>
			<div className={classes.icon}>
				<i className='fa-solid fa-trophy'>: {user.wins}</i>
				{/* <i className='fa-solid fa-bolt'>: {user.lose}</i> */}
				<i className='fa-solid fa-message'></i>
				<i className='fa-solid fa-user-plus' onClick={addFriendHandler}></i> 
				<i className='fa-solid fa-table-tennis-paddle-ball'></i>
			</div>
		</div>
	)
}

export default LeaderboardProfil;
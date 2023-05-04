import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { User, UserContext } from '../../store/users-contexte';

const LeaderboardProfil: React.FC<{user: User}> = ( { user }) => {

	return (
		<div className={classes.container}>
			<ProfilIcon user={user}/>
			<p>{user.nickname}</p>
			<div className={classes.icon}>
				<i className='fa-solid fa-trophy'>: {user.wins}</i>
				<i className='fa-solid fa-bolt'>: {user.lose}</i>
				<i className='fa-solid fa-message'></i>
				<i className='fa-solid fa-user-minus'></i>
				<i className='fa-solid fa-table-tennis-paddle-ball'></i>
			</div>
		</div>
	)
}

export default LeaderboardProfil;
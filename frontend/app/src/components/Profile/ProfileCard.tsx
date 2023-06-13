import React, { useEffect } from 'react';

import { UserAPI } from '../../store/users-contexte';

import classes from '../../sass/components/Profile/ProfileCardInfo.module.scss';
import ProfilIcon from './ProfilIcon';

const ProfileCard: React.FC<{ user?: UserAPI | null}> = ( { user } ) => {

	return (
		<div className={classes.container}>
			<ProfilIcon user={user} displayCo={false} size={['15rem', '15rem']}/>
			<div className={classes.user}>
				<h1>{user?.name}</h1>
				<p>{user?.email}</p>
			</div>
			<div className={classes.stat}>
				<div className={classes.info}>
					<i className="fa-solid fa-trophy"></i>
					<p>{user?.wins}</p>
				</div>

				<div className={classes.info}>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					<p>{ user?.gamesPlayed }</p>
				</div>
			</div>
		</div>

	);
};

export default ProfileCard;
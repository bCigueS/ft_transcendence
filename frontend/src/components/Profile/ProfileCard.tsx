import React, { useContext } from 'react';

import { UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Profile/ProfileCardInfo.module.scss';

const ProfileCard: React.FC = () => {

	const userCtx = useContext(UserContext);

	return (
		<div className={classes.container}>
			<div className={classes.picture}></div>
			<div className={classes.user}>
				<h1>{userCtx.user.nickname}</h1>
				<p>{userCtx.user.login}</p>
			</div>
			<div className={classes.stat}>
				<div className={classes.info}>
					<i className="fa-solid fa-trophy"></i>
					<p>{userCtx.user.wins}</p>
				</div>
				<div className={classes.info}>
					<i className="fa-solid fa-bolt"></i>
					<p>{userCtx.user.lose}</p>
				</div>
				<div className={classes.info}>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					<p>
						{
							`${userCtx.user.wins / (userCtx.user.wins + userCtx.user.lose) * 100}%`
						}
					</p>
				</div>
			</div>
		</div>

	);
};

export default ProfileCard;
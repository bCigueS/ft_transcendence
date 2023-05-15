import React, { useContext } from 'react';

import { User, UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Profile/ProfileCardInfo.module.scss';
import ProfilIcon from './ProfilIcon';

const ProfileCard: React.FC<{ user?: User}> = ( { user } ) => {

	const userCtx = useContext(UserContext);

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
					<i className="fa-solid fa-bolt"></i>
					{/* <p>{user?.lose}</p> */}
				</div>
				<div className={classes.info}>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					{/* <p>
						{ user &&
							user.lose !== 0
							? `${user.wins / (user.wins + userCtx.user.lose) * 100}%`
							: '100' 
						}
					</p> */}
				</div>
			</div>
		</div>

	);
};

export default ProfileCard;
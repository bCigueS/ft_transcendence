import React from 'react';
import { User } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfilIcon.module.scss';

const ProfilIcon: React.FC<{user: User}> = ( props ) => {
	return (
		<div className={classes.profilPic}>
			<div className={classes.picture}>
				<img src={props.user.profilePic} alt={props.user.nickname} />
			</div>
			<i 
				className="fa-solid fa-circle" 
				style={{color: props.user.connected ? 'green' : 'red' }
				}>
			</i>
		</div>
	)
}

export default ProfilIcon;
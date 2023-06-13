import React, { useContext } from 'react';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';
import { UserContext } from '../store/users-contexte';

const Profile: React.FC = () => {

	const userCtx = useContext(UserContext);

	// console.log(params.id);

	// FOR DISPLAYING CORRECT PROFIL PAGE
	// const displayUser = (() => {
	// 	if (params.id === undefined)
	// 		return (userCtx.user);
	// 	else {
	// 		return (userCtx.userList.find(user => user.nickname.toLowerCase() === params.id?.toLowerCase()))
	// 	}
	// });

	return (
		<div className={classes.profilPage}>
			<ProfileCardInfo user={userCtx.user} />
			{/* { displayUser() !== undefined &&
				<ProfileCardInfo user={displayUser()} />
			} */}
			<ProfileContent user={userCtx.user} />
		</div>
		
	);
};

export default Profile;


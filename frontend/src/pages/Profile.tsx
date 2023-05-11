import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';
import { UserContext } from '../store/users-contexte';

const Profile: React.FC = () => {

	const userCtx = useContext(UserContext);
	const params = useParams();

	console.log(params.id);

	const displayUser = (() => {
		if (params.id === undefined)
			return (userCtx.user);
		else {
			return (userCtx.userList.find(user => user.nickname.toLowerCase() === params.id?.toLowerCase()))
		}
	});

	return (
		<div className={classes.profilPage}>
			{ displayUser() !== undefined &&
				<ProfileCardInfo user={displayUser()} />
			}
			<ProfileContent user={displayUser()}/>
		</div>
		
	);
};

export default Profile;
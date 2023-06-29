import React, { useCallback, useContext, useEffect, useState } from 'react';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {

	const userCtx = useContext(UserContext);
	const params = useParams();
	const [ displayedUser, setDisplayedUser ] = useState<UserAPI | null>(null);

	const fetchDisplayUser = useCallback(async () => {
		const response = await fetch('http://localhost:3000/users/' + params.id, {
			method: 'GET',
			headers: {
				'Authorization' : 'Bearer ' + userCtx.logInfo?.token
			}
		});
		const data = await response.json();

		if (!response.ok)
			throw new Error("Failed to fetch User");
		
		const dataUser: UserAPI = {
			id: data.id,
			name: data.name,
			email: data.email,
			avatar: data.avatar,
			doubleAuth: data.doubleAuth,
			wins: data.wins,
			gamesPlayed: 0,
			connected: data.status === 1 ? true : false,
		}
		setDisplayedUser(dataUser);
	}, [params.id, userCtx.logInfo?.token]);


	useEffect(() => {
		fetchDisplayUser();
	}, [fetchDisplayUser]);

	return (
		<div className={classes.profilPage}>
			<ProfileCardInfo user={displayedUser} />
			<ProfileContent user={displayedUser} />
		</div>
		
	);
};

export default Profile;


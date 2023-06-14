import React, { useCallback, useEffect, useState } from 'react';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';
import { UserAPI } from '../store/users-contexte';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {

	const params = useParams();
	const [ displayedUser, setDisplayedUser ] = useState<UserAPI | null>(null);

	const fetchDisplayUser = useCallback(async () => {
		const response = await fetch('http://localhost:3000/users/' + params.id);
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
		}
		setDisplayedUser(dataUser);
	}, [params.id]);

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


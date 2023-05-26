import React, { useContext } from 'react';
import { json, redirect, useParams } from 'react-router-dom';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';
import { UserAPI, UserContext } from '../store/users-contexte';

const Profile: React.FC = () => {

	const userCtx = useContext(UserContext);
	const params = useParams();

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

export async function action({request, params} : {request: Request, params: any }): Promise<Response> {
	
	const data = await request.formData();
	const settingData = {
		name: data.get('name'),
	}
	
	const response = await fetch('http://localhost:3000/users/1' , {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settingData)
	});

	if (response.status === 400) {
		return response;
	}

	if (!response.ok) {
		throw json({message: "Could not change settings"}, { status: 400});
	}

	return redirect('/');
}

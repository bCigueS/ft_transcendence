import React, { useContext } from 'react';
import { UserAPI, UserContext } from '../../store/users-contexte';
import ProfilPatch from './ProfilPatch';
import { json } from 'react-router-dom';
import path from 'path';


const ProfilSettings: React.FC<{user: UserAPI | null}> = ( { user } ) => {

	const userCtx = useContext(UserContext);

	const handlePatchUser = async(FormData: any) => {
		const patchData = {
			name: FormData.get('name'),	
		}

		const avatarData = {
			avatar: FormData.get('avatar'),
		}

		if (avatarData.avatar) {
			console.log(avatarData.avatar);
			const avatarResponse = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/upload-avatar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: FormData
			})
		}

		if (patchData.name) {
			const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(patchData)
			});
			
			if (response.status === 400) {
				return response;
			}
			
			if (!response.ok) {
				throw json({message: 'Could not Patch User.'}, {status: 500});
			}
		}

		userCtx.fetchUser();
	}


	return (
		<ProfilPatch onPatchUser={handlePatchUser}/>
	)
}

export default ProfilSettings;
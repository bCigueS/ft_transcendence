import React, { useContext } from 'react';
import { UserAPI, UserContext } from '../../store/users-contexte';
import ProfilPatch from './ProfilPatch';
import { json } from 'react-router-dom';


const ProfilSettings: React.FC<{user: UserAPI | null}> = ( { user } ) => {

	const userCtx = useContext(UserContext);

	const handlePatchUser = async(DataForm: any) => {

		const patchData = {
			name: DataForm.get('name') === '' ? userCtx.user?.name : DataForm.get('name'),
			doubleAuth: DataForm.get('auth') === 'true' ? true : false,
			
		}

		const avatarData = new FormData();
		avatarData.append('file', DataForm.get('file'))

		if (DataForm.get('file').name) {
			console.log(avatarData);
			const avatarResponse = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/upload-avatar', {
				method: 'POST',
				body: avatarData
			})

			if (avatarResponse.status === 422) {
				return avatarResponse;
			}

			if (!avatarResponse.ok) {
				throw new Error("Failed to upload Avatar");
			}
		}

		if (patchData) {
			const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(patchData)
			});
			
			if (response.status === 409 || response.status === 400) {
				return response;
			}
			
			if (!response.ok) {
				throw json({message: 'Could not Patch User.'}, {status: 500});
			}
		}

		window.location.reload();
		userCtx.fetchUser();
	}


	return (
		<ProfilPatch onPatchUser={handlePatchUser}/>
	)
}

export default ProfilSettings;

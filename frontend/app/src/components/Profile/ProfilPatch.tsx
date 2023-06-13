import React, { FormEvent, useContext } from 'react';
import classes from '../../sass/components/Profile/ProfilPatch.module.scss';
import ProfilIcon from './ProfilIcon';
import { UserContext } from '../../store/users-contexte';

interface PatchUser {
	onPatchUser: (formData: FormData) => Promise<void | Response>;
}

const PatchForm: React.FC<PatchUser> = ({ onPatchUser }) => {

	const userCtx = useContext(UserContext);

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await onPatchUser(formData);
	}

	return (
		<form method='patch' className={classes.container} onSubmit={handleSubmit}>
			<h1>User Information</h1>
			<div className={classes.label}>
				<label htmlFor="name">User name</label>
				<input type="text" id='name' name='name' placeholder='new username' maxLength={12}/>
			</div>
			<div className={classes.label}>
				<h2>Double Authentication</h2>
				<label htmlFor="switch" className={classes.switch}>
					<input type="checkbox" id='switch' name='auth'/>
					<span className={classes.slider}></span>
				</label>
			</div>
			<div className={classes.label}>
				<ProfilIcon user={userCtx.user} displayCo={false}/>
				<label htmlFor="avatar" className={classes.fileLabel}>Change your avatar</label>
				<input 
					type="file" 
					id='avatar'
					name='avatar'
					accept=".png, .jpg, .jpeg"
					className={classes.file}
				/>
			</div>
			<button type="submit">Confirm</button>
		</form>
	)
}

export default PatchForm;
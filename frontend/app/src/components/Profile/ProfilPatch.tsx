import React, { FormEvent, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Profile/ProfilPatch.module.scss';
import ProfilIcon from './ProfilIcon';
import { UserContext } from '../../store/users-contexte';
import { type } from 'os';

interface PatchUser {
	onPatchUser: (formData: FormData) => Promise<void | Response>;
}

const PatchForm: React.FC<PatchUser> = ({ onPatchUser }) => {

	const userCtx = useContext(UserContext);
	const [ enteredText, setEnteredText ] = useState<string>(''); 
	const [ isChecked, setIsChecked ] = useState<boolean>(false);
	const [ placeholder, setPlaceholder ] = useState<string>('');
	const [ typeError, setTypeError ] = useState<string>('');

	useEffect(() => {
		if (userCtx.user?.doubleAuth === true)
			setIsChecked(true);
	}, []);

	const doubleAuthHandler = () => {
		setIsChecked(!isChecked);
	}

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		formData.append('auth', String(isChecked));
		const response = await onPatchUser(formData);
		setEnteredText('');
		
		if (response?.status === 409) {
			setPlaceholder("Already Exist!");
			console.log("Error");
		}
		
		if (response?.status === 400) {
			console.log('response: ', response);
			setPlaceholder("Name too short!")
		}

		if (response?.status === 422) {
			console.log('Response: ', response);
			setTypeError('Not correct type (jpg/png/jpeg)');
		}
	}

	const nameHandler = (event: any) => {
		setEnteredText(event.target.value);
	}

	return (
		<form method='patch' className={classes.container} onSubmit={handleSubmit}>
			<h1>User Information</h1>
			<div className={classes.label}>
				<label htmlFor="name">User name</label>
				<input 
					type="text" 
					id='name' 
					name='name' 
					value={enteredText} 
					onChange={nameHandler}
					placeholder={placeholder} 
					maxLength={12}/>
			</div>
			<div className={classes.label}>
				<h2>Double Authentication</h2>
				<label htmlFor="switch" className={classes.switch}>
					<input type="checkbox" id='switch' name='auth' checked={isChecked} onChange={doubleAuthHandler} value={isChecked ? 'true' : 'false'}/>
					<span className={classes.slider}></span>
				</label>
			</div>
			<div className={classes.label} style={{flexDirection: 'column', gap:'1.5rem', justifyContent:'flex-start'}}>
				<div style={{ width: '100%', display: 'flex' , flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
					<ProfilIcon user={userCtx.user} displayCo={false} />
					<label htmlFor="avatar" className={classes.fileLabel}>Change your avatar</label>
					<input 
						type="file" 
						id='avatar'
						name='file'
						accept=".png, .jpg, .jpeg"
						className={classes.file}
					/>
				</div>
				{
					typeError &&
					<p className={classes.error}>{typeError}</p>
				}
			</div>
			<button type="submit">Confirm</button>
		</form>
	)
}

export default PatchForm;
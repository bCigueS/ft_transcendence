import React, { FormEvent, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Profile/ProfilPatch.module.scss';
import ProfilIcon from './ProfilIcon';
import { UserContext } from '../../store/users-contexte';
import DefaultPreview from '../../assets/images/default.jpg';

interface PatchUser {
	onPatchUser: (formData: FormData) => Promise<void | Response>;
}

const PatchForm: React.FC<PatchUser> = ({ onPatchUser }) => {

	const userCtx = useContext(UserContext);
	const [ enteredText, setEnteredText ] = useState<string>(''); 
	const [ isChecked, setIsChecked ] = useState<boolean>(false);
	const [ placeholder, setPlaceholder ] = useState<string>('');
	const [ typeError, setTypeError ] = useState<string>('');
	const [ filePreview, setFilePreview ] = useState<string | null>('');



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
	
	const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setFilePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setFilePreview(null);
		}
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
			<div className={classes.label} style={{flexDirection: 'column', gap:'1.5rem', justifyContent:'flex-start'}}>
				<div style={{ width: '100%', display: 'flex' , flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
					{/* <ProfilIcon user={userCtx.user} displayCo={false} /> */}
					<div className={classes.picture}>
						{
							filePreview ? 
							<img 
							src={filePreview} 
							alt=""
							/> 
							: <img 
							src={DefaultPreview} 
							alt=""
							/>
						}
					</div>

					<label htmlFor="avatar" className={classes.fileLabel}>Change your avatar</label>
					<input 
						type="file" 
						id='avatar'
						name='file'
						accept=".png, .jpg, .jpeg"
						className={classes.file}
						onChange={imageChangeHandler}
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
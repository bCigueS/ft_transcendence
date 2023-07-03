import React, { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Profile/ProfilPatch.module.scss';
import DefaultPreview from '../../assets/images/default.jpg';
import { UserContext } from '../../store/users-contexte';

interface PatchUser {
	onPatchUser: (formData: FormData) => Promise<void | Response>;
}

const PatchForm: React.FC<PatchUser> = ({ onPatchUser }) => {


	const userCtx = useContext(UserContext);
	const [ imageUrl, setImageUrl ] = useState<string>('');
	const [ enteredText, setEnteredText ] = useState<string>(''); 
	const [ placeholder, setPlaceholder ] = useState<string>('');
	const [ typeError, setTypeError ] = useState<string>('');
	const [ filePreview, setFilePreview ] = useState<string | null>('');

	const fetchAvatar = useCallback(async() => {
		if (userCtx.logInfo?.userId === undefined)
			return ;
		try {
			const response = await fetch('http://localhost:3000/users/' + userCtx.logInfo.userId + '/avatar', {
				method: 'GET',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				}
			});
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);

				setImageUrl(url);
			} else {
				throw new Error("Error in fetching avatar!");				
			}
		} catch (error: any) {
			console.error(error.message)
		}
	}, [userCtx.logInfo?.userId, userCtx.logInfo?.token]);

	useEffect(() => {
		fetchAvatar();
	}, [fetchAvatar]);

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const response = await onPatchUser(formData);
		setEnteredText('');
		
		if (response?.status === 409) {
			setPlaceholder("Already Exist!");
			console.error("Error");
		}
		
		if (response?.status === 400) {
			console.error('response: ', response);
			setPlaceholder("Name too short!")
		}

		if (response?.status === 422) {
			console.error('Response: ', response);
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
							src={imageUrl} 
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
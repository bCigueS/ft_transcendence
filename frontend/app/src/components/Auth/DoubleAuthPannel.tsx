import React, { FormEvent, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Auth/DoubleAuthPannel.module.scss';
import DefaultImage from '../../assets/images/default.jpg';
import { UserContext } from '../../store/users-contexte';

const DoubleAuthPannel: React.FC = () => {

	const userCtx = useContext(UserContext)
	const [ imageUrl, setImageUrl ] = useState<string>('');
	const [ isChecked, setIsChecked ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | null>(null);

	useEffect(() => {
		if (userCtx.user?.doubleAuth === true)
			setIsChecked(true);
	}, [userCtx.user?.doubleAuth]);


	const fetchDisableDoubleAuth = async() => {
		try { 
			const response = await fetch('http://localhost:3000/users/2fa/disable', {
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + userCtx.logInfo?.token,
				}
			})

			if (!response.ok)
				throw new Error("Failed to disable 2fa");
		} catch(error: any) {
			console.error(error.message);
		}
		userCtx.fetchUser();
	}

	const fetchDoubleAuth = async() => {

		try {
			const response = await fetch('http://localhost:3000/users/2fa/add', {
				method: 'POST',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				}
			});
			if (!response.ok)
				throw new Error("Failed to post 2fa");

			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);

				setImageUrl(url);
			}
		} catch (error: any) {
			setError(error.message);
			console.error(error.message);
		}
	}
	const doubleAuthHandler = () => {
		if (isChecked) {
			fetchDisableDoubleAuth();
		}
		else {
			fetchDoubleAuth();
		}
		setIsChecked(!isChecked);
	}

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const codeData = {
			token: formData.get('code')
		}
		try	{
		const response = await fetch('http://localhost:3000/users/2fa/verify', {
			method: 'POST',
			headers: {
				'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codeData)
		})

		if (!response.ok)
			throw new Error("Failed to fetch 2fa");
		const data = await response.json();
		if (data.result === true) {
			userCtx.login();
			window.location.reload();

		} else {
			setError("Not the right code try again");
		}

		} catch (error: any) {
			console.error(error.message);
		}
	}

	return (
		<div className={classes.container}>
			

			<h1>Authentication</h1>
			<div className={classes.label}>
				<label htmlFor="switch" className={classes.switch}>
					<input type="checkbox" id='switch' name='auth' checked={isChecked} onChange={doubleAuthHandler} value={isChecked ? 'true' : 'false'}/>
					<span className={classes.slider}></span>
				</label>
			</div>
			<div>
				<img src={imageUrl !== '' ? imageUrl : DefaultImage } alt="Qrcode" />
			</div>
			<form method="post" onSubmit={handleSubmit}>
				<input type="text" name='code'/>
				<button type="submit">Submit</button>
			</form>
			{
				error && 
				<p>{error}</p>
			}
		</div>
	)
}

export default DoubleAuthPannel;
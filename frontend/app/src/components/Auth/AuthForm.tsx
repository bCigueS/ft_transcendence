import React, { useContext, useState, FormEvent } from 'react';
import { Form } from 'react-router-dom';
import { UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Auth/AuthForm.module.scss';
import ProfilPatch from '../Profile/ProfilPatch';
import DoubleAuthPannel from './DoubleAuthPannel';

interface AuthFormProps {
	onAuthenticate: (formData: FormData) => Promise<void | Response>;
}


//	PREVIOUS VERSION

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticate }) => {

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await onAuthenticate(formData);
	}	
	// useEffect(() => {
	// 	if (window.location.href.includes("code="))
	// 		setLogCode(window.location.href.split("code=")[1])
	// }, [])

	// useEffect(() => {
	// 	if (logCode !== "") {
	// 		const fetchToken = async () => {
	// 			const response = await fetch("http://localhost:3000/auth/me", {
	// 				method: "POST",
	// 				headers: {
	// 				"Content-Type": "application/json"
	// 				},
	// 				body: JSON.stringify({code: logCode}),
	// 			});
	// 			if (response.ok) {
	// 				const data = await response.json();
	// 				setToken(data.token.access_token);
	// 			}
	// 		}
	// 		fetchToken()
	// 	}
	// }, [logCode])

	// useEffect(() => {
	// 	if (token) {
	// 		userCtx.saveToken(token);
	// 		setTokenAuth(token);
	// 		setIsLogged(true);
	// 	}
	// }, [token, isLogged])


	return (
		<>
			<form method='post' onSubmit={handleSubmit}>
				<h1>Connect Debug</h1>
				<p>Password is 'lolilolilol'</p>
				<div>
					<label htmlFor="name">Username</label>
					<input type="text" name="name" id="name" />
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" />
				</div>
				<button type="submit">Connect</button>
			</form>
						
			{/* {	!isLogged &&
				<div className={classes.loggin}>
					<a  href={`http://127.0.0.1:3000/auth/forty-two`}>
					<button 
						className = {classes.button}>
							Log in with<br/>
							<span>42</span>
					</button>
					</a>
				</div>
			}

			{
				isLogged &&
				<ProfilPatch/>
				// <DoubleAuthPannel />
			} */}
		</>
	)
}

export default AuthForm;
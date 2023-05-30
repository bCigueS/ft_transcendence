import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Form, redirect, useSearchParams } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';
import { UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Auth/AuthForm.module.scss';


/* 
*	Component for User connection throught 42 API
*/


//	PREVIOUS VERSION

const AuthForm = () => {

	const userCtx = useContext(UserContext);
	const [ isLogged, setIsLogged ] = useState<boolean>(false);
	const [ logCode, setLogCode ] = useState<string>("");
	const [ token, setToken ] = useState<string>("");
	
	useEffect(() => {
		if (window.location.href.includes("code="))
			setLogCode(window.location.href.split("code=")[1])
	}, [])

	useEffect(() => {
		if (logCode !== "") {
			const fetchToken = async () => {
				const response = await fetch("http://localhost:3000/auth/me", {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify({code: logCode}),
				});
				if (response.ok) {
					const data = await response.json();
					setToken(data.token.access_token);
				}
			}
			fetchToken()
		}
	}, [logCode])

	useEffect(() => {
		if (token) {
			userCtx.saveToken(token);
			setTokenAuth(token);
			setIsLogged(true);
		}
	}, [token, isLogged])

	return (
		<>
			{	!isLogged &&
				<div className={classes.loggin}>
					<a  href={`http://127.0.0.1:3000/auth/forty-two`}>
					<button className = {classes.button}>Log in with 42</button>
					</a>
				</div>
			}

			{
				isLogged &&
				<Form method='patch' className={classes.container}>
					<h1>User Information</h1>
					<div className={classes.label}>
						<label htmlFor="name">User Name</label>
						<input type="text" id="name" name='name' />
					</div>
					<div className={classes.label}>
						<label htmlFor="switch">Double Authentication</label>
						<input type="checkbox" id="switch" name='auth' />
					</div>
					<div className={classes.label}>
						<label htmlFor="avatar">Avatar</label>
						<input type="file" id="avatar" name='avatar' />
					</div>
					<button>Confirm</button>
				</Form>
			}
		</>
	)
}

export default AuthForm;
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Auth/AuthForm.module.scss';
import { Form, useActionData } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';
import { UserContext } from '../../store/users-contexte';

interface DataError {
	statusCode?: number,
	errors?: string,
	message?: string,
}


const AuthForm: React.FC = () => {

	const data: DataError = useActionData() as DataError;
	const userCtx = useContext(UserContext);
	const [ logCode, setLogCode ] = useState<string>("");
	const [ token, setToken ] = useState<string>("");
	const [ userId, setUserId ] = useState<string>('');
	const [ doubleAuth, setDoubleAuth ] = useState<boolean>(false);
		
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
					setToken(data.accessToken);
					setUserId(data.userId);
					console.log(data);
					setDoubleAuth(data.doubleAuth);
				}
			}
			fetchToken();
		}
	}, [logCode])

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const codeData = {
			userId: userId,
			code: formData.get('code')
		}
		try	{
		const response = await fetch('http://localhost:3000/auth/verify', {
			method: 'POST',
			headers: {
				// 'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codeData)
		})

		if (!response.ok)
			throw new Error("Failed to fetch 2fa");

		const data = await response.json();
		console.log(data);
		if (data.result !== false) {
			setToken(data.accessToken);
			userCtx.login();
			window.location.assign("http://127.0.0.1:8000");
		}

		} catch (error: any) {
			console.error(error.message);
		}
	}

	
	useEffect(() => {
		if (token || doubleAuth) {
			setTokenAuth(token, userId);
			if (doubleAuth === false) {
				console.log("Je log")
				userCtx.login();
				window.location.assign("http://127.0.0.1:8000");
			}
		}
	}, [userId])



	return (
		<>
			{
				!doubleAuth &&
				<Form className={classes.logginForm} method='post'>
					<h1>Connect Debug</h1>
					<p>Password is 'lolilolilol'</p>
					<div className={classes.label}>
						<label htmlFor="name">Username</label>
						<input type="text" name="name" id="name" />
					</div>

					<div className={classes.label}>
						<label htmlFor="password">Password</label>
						<input type="password" name="password" id="password" />
					</div>
					<button>Connect</button>
					{ data && data.message &&
						<p className={classes.error}><span>Error {data.statusCode}</span>{data.message}</p>
					}
				</Form>		
			}
			{
				!doubleAuth && 
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
				doubleAuth && 
				<div className={classes.test}>
					<form action="post" onSubmit={handleSubmit} className={classes.code}>
						<label htmlFor="code">Enter your <span>Google Authenticator</span> code</label>
						<input type="text" name='code' maxLength={6} />
						<button type='submit'>Log in</button>
					</form>
				</div>
			}
		</>
	)
}

export default AuthForm;



import React, { useEffect, useState } from 'react';
import classes from '../../sass/components/Auth/AuthForm.module.scss';
import { Form, useActionData } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';

interface DataError {
	statusCode?: number,
	errors?: string,
	message?: string,
}


const AuthForm: React.FC = () => {

	const data: DataError = useActionData() as DataError;
	const [ isLogged, setIsLogged ] = useState<boolean>(false);
	const [ userId, setUserId ] = useState<string>('');
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
					setToken(data.accessToken);
					setUserId(data.userId);
				}
			}
			fetchToken()
		}
	}, [logCode])

	useEffect(() => {
		if (token) {
			setTokenAuth(token, userId);
			setIsLogged(true);
			window.location.reload();
		}
	}, [token, isLogged, userId])


	return (
		<>
			{/* <Form className={classes.logginForm} method='post' onSubmit={handleSubmit}> */}
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
				<div className={classes.loggin}>
					<a  href={`http://127.0.0.1:3000/auth/forty-two`}>
					<button 
						className = {classes.button}>
							Log in with<br/>
							<span>42</span>
					</button>
					</a>
				</div>
		</>
	)
}

export default AuthForm;


// https://api.intra.42.fr/oauth/authorize?client_id=your_very_long_client_id&redirect_uri=http%3A%2F%2Flocalhost%3A1919%2Fusers%2Fauth%2Fft%2Fcallback&response_type=code&scope=public&state=a_very_long_random_string_witchmust_be_unguessable'
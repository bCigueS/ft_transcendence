import React, { useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Auth/AuthForm.module.scss';
import { Form, useActionData } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';
import { UserAPI, UserContext } from '../../store/users-contexte';

interface DataError {
	statusCode?: number,
	errors?: string,
	message?: string,
}


const AuthForm: React.FC = () => {

	const data: DataError = useActionData() as DataError;
	const userCtx = useContext(UserContext);
	const [ isLogged, setIsLogged ] = useState<boolean>(false);
	const [ user, setUser ] = useState<UserAPI | undefined>(undefined);
	const [ userId, setUserId ] = useState<string>('');
	const [ logCode, setLogCode ] = useState<string>("");
	const [ token, setToken ] = useState<string>("");
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
				}
			}
			fetchToken();
		}
	}, [logCode])
	
	useEffect(() => {
		const fetchUser = async() => {
			const response = await fetch("http://localhost:3000/users/" + userId, {
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token,
				}
			})
			const data = await response.json();
			const userConnect: UserAPI = {
				id: data.id,
				name: data.name,
				email: data.email,
				avatar: data.avatar,
				doubleAuth: data.doubleAuth,
				wins: data.wins
			}
			setUser(userConnect);
		}
		if (token)
			fetchUser();
	}, [token])

	useEffect(() => {
		if (token) {
			console.log(user);
			setTokenAuth(token, userId);
			setIsLogged(true);
			if (user?.doubleAuth === true) {
				setDoubleAuth(true);
				console.log("je dois rediriger vers Double Factor")
			}
			else {
				userCtx.login();
				window.location.reload();
			}
		}
	}, [user])



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
				<p>CA MARCHE</p>
			}
		</>
	)
}

export default AuthForm;


// https://api.intra.42.fr/oauth/authorize?client_id=your_very_long_client_id&redirect_uri=http%3A%2F%2Flocalhost%3A1919%2Fusers%2Fauth%2Fft%2Fcallback&response_type=code&scope=public&state=a_very_long_random_string_witchmust_be_unguessable'
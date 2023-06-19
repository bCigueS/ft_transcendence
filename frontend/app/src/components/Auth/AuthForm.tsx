import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Form, redirect, useSearchParams } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';
import { UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Auth/AuthForm.module.scss';
import ProfilPatch from '../Profile/ProfilPatch';
import DoubleAuthPannel from './DoubleAuthPannel';


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
				// <DoubleAuthPan	// .tab {
	// 	overflow: hidden;
	// 	display: flex;
	// 	justify-content: center;
	// 	flex-direction: row;
	// 	gap: 2rem;
		
	// 	.btn {
	// 		background-color: inherit;
	// 		float: left;
	// 		border: none;
	// 		outline: none;
	// 		cursor: pointer;
	// 		padding: 1rem 1.4rem;
	// 	}
	// 	.active {
	// 		@include shadowBox();
	// 		padding: 0.8rem 1.2rem;

	// 		border: 0.2rem solid black;
	// 		border-bottom: none;
	// 		background-color: $almost-white;
	// 	}
	// }nel />
			}
		</>
	)
}

export default AuthForm;
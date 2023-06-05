import React, { useContext, useEffect } from 'react';
import { json } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { UserContext } from '../store/users-contexte';

const AuthenticationPage = () => {

	const userCtx = useContext(UserContext);

	const handleAuthentication = async (formData: any) => {
		const authData = {
			name: formData.get('name'),
			password: formData.get('password'),
		};

		const response = await fetch('http://localhost:3000/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(authData)
		});

		if (response.status === 422 || response.status === 400 || response.status === 401) {
			return response;
		}
	
		if (!response.ok) {
			throw json({message: 'Could not authenticate user.'}, { status: 500});
		}
	
		const resData = await response.json();
		const token = resData.accessToken;
		const userId = resData.userId;
		localStorage.setItem('tokenDebug', token);
		localStorage.setItem('userId', userId);
		userCtx.saveToken(token, userId);
		
		userCtx.fetchUser();
		window.location.reload();
	}

	return (
		<AuthForm onAuthenticate={handleAuthentication}/>
	)
}

export default AuthenticationPage;
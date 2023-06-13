import React, { useContext } from 'react';
import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { UserContext } from '../store/users-contexte';

const AuthenticationPage = () => {

	return (
		<AuthForm />
	)
}

export default AuthenticationPage;

export const action = async({ request }: { request: Request }) => {
	const data = await request.formData();

	const userData = {
		name: data.get('name'),
		password: data.get('password'),
	}

	const response = await fetch('http://localhost:3000/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	});

	if (response.status === 422 || response.status === 400 || response.status === 401 || response.status === 404) {
		return response;
	}

	if (!response.ok) {
		throw json({message: "Could not loggin."}, {status: 500});
	}

	const resData = await response.json();
	const token = resData.accessToken;
	const userId = resData.userId;
	localStorage.setItem('tokenDebug', token);
	localStorage.setItem('userId', userId);

	return redirect('/');
}
import React from 'react';
import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';

const AuthenticationPage = () => {
	return (
		<AuthForm />
	)
}

export default AuthenticationPage;

export async function action({request}: { request: Request }) : Promise<Response> {
	const data = await request.formData();
	const authData = {
		name: data.get('username'),
		password: data.get('password')
	}

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
	const token = resData.accessoken;

	localStorage.setItem('token', token);

	return redirect('/');
}
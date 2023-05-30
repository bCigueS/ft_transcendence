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


	// const searchParams = new URL(request.url).searchParams;

	// if (code) {
	// 	console.log("Ya un code");
	// 	const response = await fetch('http://localhost:3000/auth/me', {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		},
	// 		body: JSON.stringify({code: code}),
	// 	});

	// 	if (response.ok) {
	// 		const data = await response.json();
	// 		console.log("Token: ", data.token.access_token);
	// 		console.log("User42: ", data.user);
	// 	}
	// }
	// else
	// 	console.log("Ya pas de code");

	return redirect('/');
}
import React, { useEffect } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';

type ActionData = {
	error: string,
	message: string,
	statusCode: number
}

const AuthForm = () => {

	const data = useActionData() as ActionData;
	const navigation = useNavigation();

	const isSubmitting = navigation.state === 'submitting';

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<Form method='post' >
			<h1>Log in</h1>
			<div>
				<label htmlFor="username">Username</label>
				<input type="text" id='username' name='username' placeholder='username' required/>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input type="password" id='password' name='password' placeholder='password' required/>
			</div>

			<p>
				{
					data && data.message && 
					data.message
				}
			</p>	{data && data.error && <ul>
				{Object.values(data.error).map(err => <li></li>)}
				</ul>}

			<button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'LogIn' }</button>
		</Form>
	)
}

export default AuthForm;
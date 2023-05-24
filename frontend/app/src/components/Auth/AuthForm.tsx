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

	const mode: string = "42log";
	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div>
			{	mode !== "42log" &&
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
			}
			{
				mode === "42log" &&
				<div>
					<p>Log with 42 API</p>
					<a href={`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=public`}>
						<button>Log in with 42</button>
					</a>
				</div>
			}
		</div>
	)
}

export default AuthForm;


// https://api.intra.42.fr/oauth/authorize?client_id=your_very_long_client_id&redirect_uri=http%3A%2F%2Flocalhost%3A1919%2Fusers%2Fauth%2Fft%2Fcallback&response_type=code&scope=public&state=a_very_long_random_string_witchmust_be_unguessable'
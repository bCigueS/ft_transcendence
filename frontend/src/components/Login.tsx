import React, {ChangeEvent, FormEvent, useState} from "react";
import { ILoginState } from '../typescript/types';

export default function Login(props: any) {

	const [state, setState] = useState<ILoginState>({
		email: '',
		pass: ''
	});

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prevState => ({ ...prevState, email: event.target.value}))
	}

	const handlePassChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prevState => ({ ...prevState, pass: event.target.value}))
	}


	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(state.email)
	}

	return(
		<form onSubmit={handleSubmit}>
			<label htmlFor="email">email</label>
			<input 
				value={ state.email }
				onChange={handleEmailChange} 
				type="email"
				placeholder="youremail@mail.com" 
				id="email" 
				name="email" 
			/>

			<label htmlFor="password">password</label>
			<input value={ state.pass }
			onChange={handlePassChange}
			type="password" 
			placeholder="**********" 
			id="password" 
			name="password"/>

			<button type="submit">Log in</button>
			<button onClick={() => props.onFormSwitch('register')}>Register</button>
		</form>
	);
};
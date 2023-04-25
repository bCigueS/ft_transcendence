import { ChangeEvent, FormEvent, useState } from "react"
import { IRegisterState } from "../typescript/types"

export default function Register(props: any) {

	const [state, setState] = useState<IRegisterState>({
		email: '',
		pass: '',
		name: ''
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prevState => ({
			...prevState, email: event.target.value
		}));
	};

	const handlePassChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prevState => ({
			...prevState, pass: event.target.value
		}));
	};

	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prevState => ({
			...prevState, name: event.target.value
		}));
	}

	return(
		<form onSubmit={handleSubmit}>
			<label htmlFor="email">Email</label>
			<input 
				value={ state.email}
				onChange={handleEmailChange}
				type="email"
				placeholder="email@email.com"
				id="email"
				name="email"
			/>

			<label htmlFor="email">Password</label>
			<input
				value={state.pass}
				onChange={handlePassChange}
				type="password"
				placeholder="**********"
				id="password"
				name="password"
			/>

			<label htmlFor="email">Name</label>
			<input
				value={state.name}
				onChange={handleNameChange}
				type="name"
				placeholder="Your Name"
				id="name"
				name="name"
			/>
			<button type="submit">Register</button>
			<button onClick={() => props.onFormSwitch('login')}>Login</button>
		</form>
	)
}
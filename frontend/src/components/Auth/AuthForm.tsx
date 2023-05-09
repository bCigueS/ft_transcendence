import React from 'react';

const AuthForm = () => {
	return (
		<form  >
			<div>
				<label htmlFor="username">Username</label>
				<input type="text" id='username' placeholder='username'/>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input type="password" id='password' name='password' placeholder='password' />
			</div>

			<button>Log in</button>
		</form>
	)
}

export default AuthForm;
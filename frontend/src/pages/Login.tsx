import React, { useState } from 'react';
import '../sass/main.scss';


const Login: React.FC = () => {

	const [btnLogin, setBtnLogin] = useState(false);

	const loginHandler = () => {
		setBtnLogin(true);
		console.log(btnLogin)
		setBtnLogin(false);
	}

	return (
		<>
			<button onClick={loginHandler} className='login-btn'>LOG IN!</button>
		</>
	)
}

export default Login;
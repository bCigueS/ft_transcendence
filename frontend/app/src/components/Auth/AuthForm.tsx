import React from 'react';
import classes from '../../sass/components/Auth/AuthForm.module.scss';
import { Form, useActionData } from 'react-router-dom';

interface DataError {
	statusCode?: number,
	errors?: string,
	message?: string,
}


const AuthForm: React.FC = () => {

	const data: DataError = useActionData() as DataError;

	console.log(data);
	return (
		<>
			{/* <Form className={classes.logginForm} method='post' onSubmit={handleSubmit}> */}
			<Form className={classes.logginForm} method='post'>
				<h1>Connect Debug</h1>
				<p>Password is 'lolilolilol'</p>
				<div className={classes.label}>
					<label htmlFor="name">Username</label>
					<input type="text" name="name" id="name" />
				</div>

				<div className={classes.label}>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" />
				</div>
				<button>Connect</button>
				{ data && data.message &&
					<p className={classes.error}><span>Error {data.statusCode}</span>{data.message}</p>
				}
			</Form>
						
			{/* {	!isLogged &&
				<div className={classes.loggin}>
					<a  href={`http://127.0.0.1:3000/auth/forty-two`}>
					<button 
						className = {classes.button}>
							Log in with<br/>
							<span>42</span>
					</button>
					</a>
				</div>
			}

			{
				isLogged &&
				<ProfilPatch/>
				// <DoubleAuthPannel />
			} */}
		</>
	)
}

export default AuthForm;
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Auth/AuthForm.module.scss';
import { json } from 'react-router-dom';
import { setTokenAuth } from '../../typescript/Auth';
import { UserContext } from '../../store/users-contexte';
import ProfilPatch from '../Profile/ProfilPatch';
import LogoPong from '../../assets/logo/pong2.svg';


const AuthForm: React.FC = () => {

	const userCtx = useContext(UserContext);
	const [ logCode, setLogCode ] = useState<string>("");
	const [ token, setToken ] = useState<string>("");
	const [ userId, setUserId ] = useState<string>('');
	const [ doubleAuth, setDoubleAuth ] = useState<boolean>(false);
	const [ newUser, setNewUser ] = useState<boolean>(false);

	const handlePatchUser = async(DataForm: any) => {

		const patchData = {
			name: DataForm.get('name') === '' ? userCtx.user?.name : DataForm.get('name'),			
		}

		const avatarData = new FormData();
		avatarData.append('file', DataForm.get('file'))

		if (DataForm.get('file').name) {
			const avatarResponse = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/upload-avatar', {
				method: 'POST',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				},
				body: avatarData
			})

			if (avatarResponse.status === 422) {
				return avatarResponse;
			}

			if (!avatarResponse.ok) {
				throw new Error("Failed to upload Avatar");
			}
		}

		if (patchData) {
			const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				},
				body: JSON.stringify(patchData)
			});
			
			if (response.status === 409 || response.status === 400) {
				return response;
			}
			
			if (!response.ok) {
				throw json({message: 'Could not Patch User.'}, {status: 500});
			}
		}

		window.location.reload();
		userCtx.fetchUser();
	}
		
	useEffect(() => {
		if (window.location.href.includes("code="))
			setLogCode(window.location.href.split("code=")[1])
	}, [])

	useEffect(() => {
		if (logCode !== "") {
			const fetchToken = async () => {
				const response = await fetch("http://localhost:3000/auth/me", {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify({code: logCode}),
				});
				if (response.ok) {
					const data = await response.json();
					setToken(data.accessToken);
					setUserId(data.userId);
					setDoubleAuth(data.doubleAuth);
					setNewUser(data.newUser);
				}
			}
			fetchToken();
		}
	}, [logCode])

	const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const codeData = {
			userId: userId,
			code: formData.get('code')
		}
		try	{
		const response = await fetch('http://localhost:3000/auth/verify', {
			method: 'POST',
			headers: {
				// 'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codeData)
		})

		if (!response.ok)
			throw new Error("Failed to fetch 2fa");

		const data = await response.json();
		if (data.result !== false) {
			setToken(data.accessToken);
			userCtx.login();
			window.location.assign("http://127.0.0.1:8000");
		}

		} catch (error: any) {
			console.error(error.message);
		}
	}

	
	useEffect(() => {
		if (token || doubleAuth) {
			setTokenAuth(token, userId);
			if (doubleAuth === false) {
				userCtx.login();
				if (newUser === false)
					window.location.assign("http://127.0.0.1:8000");
			}
		}
	}, [userCtx, userId, token, doubleAuth, newUser])



	return (
		<>
			{/* {
				!doubleAuth &&
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
			} */}
			{
				(!doubleAuth && !newUser) && 
				<div className={classes.loggin}>
					<img className={classes.imgLogo} src={LogoPong} alt="LogoPong" />

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
				newUser && 
				<ProfilPatch onPatchUser={handlePatchUser}/>
			}
			{
				doubleAuth && 
				<div className={classes.test}>
					<form action="post" onSubmit={handleSubmit} className={classes.code}>
						<label htmlFor="code">Enter your <span>Google Authenticator</span> code</label>
						<input type="text" name='code' maxLength={6} typeof='number' />
						<button type='submit'>Log in</button>
					</form>
				</div>
			}
		</>
	)
}

export default AuthForm;



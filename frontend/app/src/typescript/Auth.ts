import { ActionFunction, redirect } from "react-router-dom";

export const getTokenDuration = () => {
	const storedExpirationData = sessionStorage.getItem('expiration');
	let expirationDate;

	const now = new Date();
	if (storedExpirationData) {
		expirationDate = new Date(storedExpirationData);
		const duration = expirationDate?.getTime() - now.getTime();
		return duration;
	}
}

export const getAuthToken = () => {

	const token = sessionStorage.getItem('token');

	if (!token) {
		return 'NONE';
	}

	const tokenDuration = getTokenDuration();
	if (tokenDuration && tokenDuration < 0) {
		return 'EXPIRED';
	}
	return token;
}

export const tokenLoader = () => {
	return getAuthToken();
}

export const setTokenAuth = (token: string, userId: string) => {
	const expiration = new Date();
	expiration.setHours(expiration.getHours() + 1);
	sessionStorage.setItem('expiration', expiration.toISOString());
	sessionStorage.setItem('token', token);
	sessionStorage.setItem('userId', userId)
	return redirect('/');
}

export const action = () => {
	const logout = async() => {
		try {
			if (getAuthToken() === 'NONE' || getAuthToken() === 'EXPIRED') 
				return ;
			const response = await fetch('http://localhost:3000/users/logout', {
				method: 'POST',
				
				headers: {
					'Authorization': 'Bearer ' + getAuthToken(),
				}
			})
			if (!response.ok) {
				throw new Error('Failed to logout');
			}
		} catch(error: any) {
			console.error(error.message);
		}
	}
	logout();
	sessionStorage.removeItem('token');
	sessionStorage.removeItem('userId');
	sessionStorage.removeItem('isLogged');
	sessionStorage.removeItem('expiration');
	return redirect('/auth');
}

export const checkAuthLoader = () => {
	const token = getAuthToken();
	if (!token)
		return redirect('/auth');
	return null;
}

export const checkTokenLoader = () => {
	const token = getAuthToken();
	const isLogged = sessionStorage.getItem('isLogged');
	if (token && isLogged === 'true') {
		return redirect('/');
	}
	return null;
}


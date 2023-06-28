import { redirect } from "react-router-dom";

export const getAuthToken = () => {

	const token = sessionStorage.getItem('token');
	return token;
}

export const tokenLoader = () => {
	return getAuthToken();
}

export const setTokenAuth = (token: string, userId: string) => {
	sessionStorage.setItem('token', token);
	sessionStorage.setItem('userId', userId)
	return redirect('/');
}

export const action = () => {
	const logout = async() => {
		const response = await fetch('http://localhost:3000/users/logout', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + getAuthToken(),
			}
		})
	}
	logout();
	sessionStorage.removeItem('token');
	sessionStorage.removeItem('userId');
	sessionStorage.removeItem('isLogged');
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


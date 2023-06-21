import { redirect } from "react-router-dom";

export const getAuthToken = () => {

	const token = localStorage.getItem('token');
	return token;
}

export const tokenLoader = () => {
	return getAuthToken();
}

export const setTokenAuth = (token: string, userId: string) => {
	localStorage.setItem('token', token);
	localStorage.setItem('userId', userId)
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
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('isLogged');
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
	if (token) {
		return redirect('/');
	}
	return null;
}


import { redirect } from "react-router-dom";

export const getAuthToken = () => {

	const token = localStorage.getItem('tokenDebug');
	return token;
}

export const tokenLoader = () => {
	return getAuthToken();
}

export const setTokenAuth = (token: string) => {
	localStorage.setItem('token', token);
	return redirect('/');
}

export const action = () => {
	localStorage.removeItem('tokenDebug');
	localStorage.removeItem('userId');
	return redirect('/');
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
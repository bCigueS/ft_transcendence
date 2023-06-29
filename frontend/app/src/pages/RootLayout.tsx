import { Navigate, Outlet, useRouteLoaderData, useSubmit } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../store/users-contexte';
import { useContext, useEffect } from 'react';
import { getAuthToken, getTokenDuration } from '../typescript/Auth';

export default function RootLayout() {

	const token = useRouteLoaderData('root');
	const submit = useSubmit();
	const userCtx = useContext(UserContext);
	
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
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
			if ((event.key === 'token' || event.key === 'userId' || event.key === 'expiration' || event.key === 'isLogged') && event.newValue === null) {
				if (userCtx.logInfo?.token) {
					logout();
					sessionStorage.removeItem('token');
					sessionStorage.removeItem('userId');
					sessionStorage.removeItem('isLogged');
					sessionStorage.removeItem('expiration');				
					window.location.reload();
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, [userCtx.logInfo?.token])

	useEffect(() => {
		if (!token) {
			return;
		}

		if (token === 'EXPIRED') {
			submit(null, {action: '/logout', method: 'post'})
			return ;
		}

		const tokenDuration = getTokenDuration();
		setTimeout(() => {
			submit(null, {action: '/logout', method: 'post'})
		}, tokenDuration)
	}, [token, submit])

	return (
		<>
			<Nav />
			<main>
				{ userCtx.isLogged === true ? <Outlet/> : <Navigate to='/auth'/>}
			</main>
		</>
	)
}
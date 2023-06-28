import { Navigate, Outlet, useRouteLoaderData, useSubmit } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../store/users-contexte';
import { useContext, useEffect } from 'react';
import { getTokenDuration } from '../typescript/Auth';

export default function RootLayout() {

	const token = useRouteLoaderData('root');
	const submit = useSubmit();
	const userCtx = useContext(UserContext);
	

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
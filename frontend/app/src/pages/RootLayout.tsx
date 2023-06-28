import { Navigate, Outlet } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../store/users-contexte';
import { useContext, useEffect } from 'react';

export default function RootLayout() {

	// const token = useRouteLoaderData('root');
	const userCtx = useContext(UserContext);
	

	useEffect(() => {
		
	}, [])

	return (
		<>
			<Nav />
			<main>
				{ userCtx.isLogged === true ? <Outlet/> : <Navigate to='/auth'/>}
			</main>
		</>
	)
}
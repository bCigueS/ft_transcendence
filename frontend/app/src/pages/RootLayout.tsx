import { Navigate, Outlet, useRouteLoaderData } from 'react-router-dom';
import Nav from '../components/Nav/Nav';

export default function RootLayout() {

	const token = useRouteLoaderData('root');

	return (
		<>
			<Nav />
			<main>
				{/* <Outlet/> */}
				{ token ? <Outlet/> : <Navigate to='/auth'/>}
			</main>
		</>
	)
}
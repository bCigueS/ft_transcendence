import { Outlet, useRouteLoaderData } from 'react-router-dom';
import ErrorPage from '../pages/Error';
import Nav from '../components/Nav/Nav';

export default function RootLayout() {

	const token = useRouteLoaderData('root');

	console.log("Data " + token);
	return (
		<>
			<Nav />
			<main>
				<Outlet/>
			</main>
		</>
	)
}
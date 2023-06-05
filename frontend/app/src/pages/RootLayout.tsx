import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav/Nav';

export default function RootLayout() {

	return (
		<>
			<Nav />
			<main>
				<Outlet/>
			</main>
		</>
	)
}
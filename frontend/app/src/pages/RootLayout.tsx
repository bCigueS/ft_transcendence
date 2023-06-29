import { Navigate, Outlet, useRouteLoaderData } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../store/users-contexte';
import { useContext } from 'react';
import DoubleAuthPannel from '../components/Auth/DoubleAuthPannel';

export default function RootLayout() {

	const token = useRouteLoaderData('root');
	const userCtx = useContext(UserContext);

	console.log(userCtx.user)
	return (
		<>
			<Nav />
			<main>
				{/* { token ? ((!userCtx.user?.doubleAuth && userCtx.isLogged) ? <Outlet/> : <DoubleAuthPannel />) : <Navigate to='/auth'/>} */}
				{ userCtx.isLogged === true ? <Outlet/> : <Navigate to='/auth'/>}
			</main>
		</>
	)
}

// En gros, 
//	Je vais me connecter a la page depuis auth, une fois que j'aurai valider je vais avoir le token, donc je vais pouvoir voir si je peux passer a la suite.
//	La je vais devoir verifier si l'utilisateur a le double auth de set si c'est le cas, il n'est pas encore connecte et est redirige vers le double auth pour valider sa connection
//	Si il ne l'a pas d'activer dans ce cas il est consider comme login

// Donc l'idee ca va etre de, pour tester, de proteger la route 
// CAS: 
//	Notre utilisateur a le double auth de set
//	On va verifier sur la 
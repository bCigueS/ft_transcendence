import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/Profile';
import PrivateMessagePage from './pages/PrivateMessagePage';
import ChatPage from './pages/Chat';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';

import './sass/main.scss';
import UsersContextProvider from './store/users-contexte';
import AuthenticationPage from './pages/Authentication';
import { action as settingAction } from './pages/Profile';
import { checkAuthLoader, checkTokenLoader, action as logoutAction, tokenLoader} from './typescript/Auth';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		id: 'root',
		loader: tokenLoader,
		children: [
			{
				index: true,
				element: <Homepage />,
				loader: checkAuthLoader,
			},
			{
				path: 'profile/:id',
				element: <ProfilePage />,
				action: settingAction,
				loader: checkAuthLoader,
			},
			{
				path: 'privmessage',
				element: <PrivateMessagePage />,
				loader: checkAuthLoader,
			},
			{
				path: 'chat',
				element: <ChatPage />,
				loader: checkAuthLoader,
			},
			{
				path: 'pong',
				element: <Game />,
				loader: checkAuthLoader,
			},
			{
				path: 'leaderboard',
				element: <Leaderboard />,
				loader: checkAuthLoader,
			},
			{
				path: 'auth',
				element: <AuthenticationPage />,
				// action: authAction,
			},
			{
				path: 'logout',
				action: logoutAction,
			},
		],
	},
]);


const App: React.FC = () => {

	useEffect(() => {
		if (localStorage.getItem('tokenDebug')) {
			console.log("J'ai le token");
		}
	}, [localStorage.getItem('tokenDebug')])

	return (
		<UsersContextProvider className="App">
			<RouterProvider router={router} />
		</UsersContextProvider>
	);
};

export default App;

// Basic Inports
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//	Components Inports
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/Profile';
import PrivateMessagePage from './pages/PrivateMessagePage';
import ChatPage from './pages/Chat';
import Game from './pages/Game';
import Leaderboard, { loader as usersLoader} from './pages/Leaderboard';
import AuthenticationPage, { action as logginAction } from './pages/Authentication';

import './sass/main.scss';
import UsersContextProvider from './store/users-contexte';
import { checkTokenLoader, action as logoutAction, tokenLoader} from './typescript/Auth';

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
			},
			{
				path: 'profile/:id',
				element: <ProfilePage />,
			},
			{
				path: 'privmessage',
				element: <PrivateMessagePage />,
			},
			{
				path: 'chat',
				element: <ChatPage />,
			},
			{
				path: 'pong',
				element: <Game />,
			},
			{
				path: 'leaderboard',
				element: <Leaderboard />,
				loader: usersLoader,
			},
			{
				path: 'logout',
				action: logoutAction,
			},
		],
	},
	{
		path: '/auth',
		element: <AuthenticationPage />,
		loader: checkTokenLoader,
		action: logginAction
	},
]);


const App: React.FC = () => {

	return (
		<UsersContextProvider className="App">
			<RouterProvider router={router} />
		</UsersContextProvider>
	);
};

export default App;

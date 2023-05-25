import React from 'react';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/Profile';
import PrivateMessagePage from './pages/PrivateMessagePage';
import ChatPage from './pages/Chat';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import AboutUs from './pages/AboutUs';

import './sass/main.scss';
import UsersContextProvider from './store/users-contexte';
import AuthenticationPage, { action as authAction} from './pages/Authentication';
import { action as settingAction } from './pages/Profile';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		id: 'root',
		children: [
			{index: true, element: <Homepage />},
			// {
			// 	path: 'profile/me',
			// 	element: <ProfilePage />,
			// 	loader: async () => {
			// 		const response = await fetch('http://localhost:3000/users/1');
			// 		const data = await response.json();
			// 		console.log('Loader');
			// 		return data.id;
			// 	},
			// 	// action: settingAction
			// },
			{
				path: 'profile/:id',
				element: <ProfilePage />,
				action: settingAction
			},
			{path: 'privmessage', element: <PrivateMessagePage />},
			{path: 'chat', element: <ChatPage />},
			{path: 'pong', element: <Game />},
			{path: 'leaderboard', element: <Leaderboard />},
			{path: 'about-us', element: <AboutUs />},
			{path: 'auth', element: <AuthenticationPage />, action: authAction},
		]
	}
])


const App: React.FC = () => {

	return (
		<UsersContextProvider className="App">
			<RouterProvider router={ router } />
		</UsersContextProvider>
	);
}

export default App;

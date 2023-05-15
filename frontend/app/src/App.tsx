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
import AuthenticationPage from './pages/Authentication';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{index: true, element: <Homepage />},
			{path: 'profile', element: <ProfilePage />},
			// {path: 'profile/:id', element: <ProfilePage />},
			// {path: 'privmessage', element: <PrivateMessagePage />},
			// {path: 'chat', element: <ChatPage />},
			// {path: 'pong', element: <Game />},
			// {path: 'leaderboard', element: <Leaderboard />},
			// {path: 'about-us', element: <AboutUs />},
			// {path: 'auth', element: <AuthenticationPage />}
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

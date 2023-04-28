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
import Rules from './pages/Rules';
import AboutUs from './pages/AboutUs';
import LoginPage from './pages/Login';

import './sass/main.scss';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{index: true, element: <Homepage />},
			{path: 'profile', element: <ProfilePage />},
			{path: 'privmessage', element: <PrivateMessagePage />},
			{path: 'chat', element: <ChatPage />},
			{path: 'pong', element: <Game />},
			{path: 'leaderboard', element: <Leaderboard />},
			{path: 'rules', element: <Rules/>},
			{path: 'about-us', element: <AboutUs />},
			{path: 'login', element: <LoginPage />}
		]
	}
])

const App: React.FC = () => {

	return (
		<div className="App">
			<RouterProvider router={ router } />
		</div>
	);
}

export default App;

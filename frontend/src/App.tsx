import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import ProfilPage from './pages/Profil';
import PrivateMessagePage from './pages/PrivateMessagePage';
import ChatPage from './pages/Chat';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Rules from './pages/Rules';
import AboutUs from './pages/AboutUs';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{index: true, element: <Homepage />},
			{path: 'profil', element: <ProfilPage />},
			{path: 'privmessage', element: <PrivateMessagePage />},
			{path: 'chat', element: <ChatPage />},
			{path: 'pong', element: <Game />},
			{path: 'leaderboard', element: <Leaderboard />},
			{path: 'rules', element: <Rules/>},
			{path: 'about-us', element: <AboutUs />},
		]
	}
])

function App() {

	return (
		<div className="App">
			<RouterProvider router={ router } />
		</div>
	);
	}

export default App;

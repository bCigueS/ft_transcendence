import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from './components/Nav'


{/* Old Stuff */}
// import Login from './components/Login';
// import  Register from './components/Register';


function App() {

	// const [currentForm, setCurrentForm] = useState('login');

	// const toggleForm = (forName: string) => {
	// 	setCurrentForm(forName);
	// }
	// {/* { currentForm === 'login' ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm} />	} */}

	return (
	<Router>
		<div className="App">
		<Nav />
		<Routes>
			<Route path='/'></Route>
			<Route path='/profil'></Route>
			<Route path='/chat'></Route>
			<Route path='/privmessage'></Route>
			<Route path='/pong'></Route>
			<Route path='/leaderboard'></Route>
			<Route path='/rules'></Route>
			<Route path='/about-us'></Route>
		</Routes>
		</div>
	</Router>
	);
	}

export default App;

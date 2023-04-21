import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from './components/Nav'
import Pong from './components/game/Pong';


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
			<Route path='/pong' element={<Pong 
					height={500}
					width={800}
					paddleHeight={100}
					paddleWidth={15}
					paddleSpeed={5}
					ballSize={10}
					upArrow={38}
					downArrow={40}
				/>}></Route>
			<Route path='/leaderboard'></Route>
			<Route path='/rules'></Route>
			<Route path='/about-us'></Route>
		</Routes>
		</div>
	</Router>
	);
	}

export default App;

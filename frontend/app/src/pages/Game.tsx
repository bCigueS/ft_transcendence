import { useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';

export default function Game() {
	// player info
	const [username, setUserName] = useState('Fany');
	const [gameId, setGameId] = useState('19');

	return (
		<div className={classes.gamePage}>
			<Pong 
				username={username}
			/>
		</div>
	)
}
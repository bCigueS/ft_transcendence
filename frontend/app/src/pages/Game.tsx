import { useContext, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';

export default function Game() {

	// Import the userContext Api (from React)
	const userCtx = useContext(UserContext);
	// player info
	const [username, setUserName] = useState('Fany');
	const [gameId, setGameId] = useState('19');

	// Acces the user id 
	console.log('Game Page userId: ', userCtx.user?.id);

	return (
		<div className={classes.gamePage}>
			<Pong 
				username={username}
			/>
		</div>
	)
}
import { useContext, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';

export default function Game() {

	// Import the userContext Api (from React)
	const userCtx = useContext(UserContext);
	// player info
	const [userId, setUserId] = useState(1);
	const [userName, setUserName] = useState('Fany');

	// Acces the user id 
	console.log('Game Page userId: ', userCtx.user?.id);

	return (
		<div className={classes.gamePage}>
			<Pong
				userId={userId}
				userName={userName}
			/>
		</div>
	)
}
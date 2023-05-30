import { useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';

export default function Game() {
	// player info
	const [userId, setUserId] = useState(1);
	const [userName, setUserName] = useState('Fany');

	return (
		<div className={classes.gamePage}>
			<Pong
				userId={userId}
				userName={userName}
			/>
		</div>
	)
}
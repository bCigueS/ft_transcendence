import { useContext, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';
import SpectatorBoard from '../components/Game/SpectatorBoard';

export default function Game() {

	// Import the userContext Api (from React)
	const userCtx = useContext(UserContext);

	// player info
	const userId = userCtx.user?.id;
	const userName = userCtx.user?.name;

	if (!userId || !userName) {
		return (
			<></>
		);
	}

	return (
		<div className={classes.gamePage}>
			{(userName === 'Faaaany') && (
				<SpectatorBoard
					userId={userId}
					gameLevel={0}
					gameRoom={'pong1'}
				/>
			)}
			{(userName !== 'Faaaany') && (
				<Pong
					userId={userId}
					userName={userName}
				/>
			)}
		</div>
	)
}
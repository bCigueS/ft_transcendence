import { useContext } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';
import SpectatorBoard from '../components/Game/SpectatorBoard';
// import { useLocation } from 'react-router-dom';

const PLAY_MODE = 0;
const SPECTATOR_MODE = 1;

export default function Game() {

	// Import the userContext Api (from React)
	const userCtx = useContext(UserContext);
	// const location = useLocation();

	// player info
	const userId = userCtx.user?.id;
	const userName = userCtx.user?.name;

	// console.log('Location: ', location.state);

	if (!userId || !userName) {
		return (
			<></>
		);
	}

	return (
		<div className={classes.gamePage}>
			{(userName === 'Faaaany') && (
				<SpectatorBoard
					mode ={SPECTATOR_MODE}
					userId={userId}
					gameLevel={0}
					gameRoom={'pong10'}
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
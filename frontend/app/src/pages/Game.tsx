import { useContext, useEffect, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';
import SpectatorBoard from '../components/Game/SpectatorBoard';
import { useLocation } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

// board mode
const PLAY_MODE = 0;
const SPECTATOR_MODE = 1;

export default function Game() {

	const userCtx = useContext(UserContext);
	const location = useLocation();
	const { state } = location;

	// player info
	const user = userCtx.user;
	const userId = userCtx.user?.id;
	const userName = userCtx.user?.name;
	const opponent = state?.opponent;
	const inviteMode = (state.gameInvitation ? true : false);

	// ---> to be checked
	// // screen info
	// const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	// const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	// const [ratio, setRatio] = useState(1);

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		setScreenWidth(window.innerWidth);
	// 		setScreenHeight(window.innerHeight);
	// 	};

	// 	window.addEventListener('resize', handleResize);

	// 	// Clean up the event listener on unmount
	// 	return () => {
	// 		window.removeEventListener('resize', handleResize);
	// 	};
	// }, []);

	// useEffect(() => {
	// 	if (info.boardWidth) {
	// 		setRatio(info.boardWidth / screenWidth);
	// 	} else if (info.boardHeight) {
	// 		setRatio(info.boardHeight / screenHeight);
	// 	}
	// }, [info.boardWidth, info.boardHeight, screenWidth, screenHeight]);

	if (!userId || !userName) {
		return (
			<></>
		);
	}

	return (
		<div className={classes.gamePage}>
			{(user?.name === 'Faaaany') && (
				<SpectatorBoard
					mode ={SPECTATOR_MODE}
					user={user}
					gameLevel={0}
					gameRoom={'pong2'}
				/>
			)}
			{(user?.name !== 'Faaaany') && (
				<Pong
					userId={userId}
					userName={userName}
					// user={user}
					// opponent={opponent}
					inviteMode={inviteMode}
				/>
			)}
		</div>
	)
}
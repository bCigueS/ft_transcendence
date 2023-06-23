import { useContext, useEffect, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';
import SpectatorBoard from '../components/Game/SpectatorBoard';
import { useLocation } from 'react-router-dom';

export default function Game() {

	const userCtx = useContext(UserContext);
	const location = useLocation();
	const { state } = location;

	// player info
	const userId = userCtx.user?.id;
	const userName = userCtx.user?.name;
	const playerId = state?.playerId;
	const opponentId = state?.opponentId;
	const inviteMode = state?.gameInvitation;
	const isInvited = state?.isInvited;
	const isSpectator = state?.isSpectator;
	const gameRoom = state?.gameRoom;
	console.log('game invitation ', inviteMode);
	console.log('isInvited ', isInvited); 
	console.log('gameRoom ', gameRoom);
	console.log('isSpectator ,', isSpectator);

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
			{(isSpectator) && (
				<SpectatorBoard
					userId={userId}
					playerId={playerId}
					opponentId={opponentId}
					gameRoom={gameRoom}
				/>
			)}
			{(!isSpectator) && (
				<Pong
					userId={userId}
					userName={userName}
					opponentId={opponentId}
					gameRoom={gameRoom}
					inviteMode={inviteMode}
					isInvited={isInvited}
				/>
			)}
		</div>
	)
}
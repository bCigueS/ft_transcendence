import { useContext, useEffect, useState } from 'react';
import Pong from '../components/Game/Pong';

import classes from '../sass/pages/Game.module.scss';
import { UserContext } from '../store/users-contexte';
import SpectatorBoard from '../components/Game/SpectatorBoard';
import { useLocation } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

export default function Game() {

	const userCtx = useContext(UserContext);
	const location = useLocation();
	const { state } = location;

	// socket
	const [ socket, setSocket ] = useState<Socket>();

	// clear location.state on page reload
	window.history.replaceState({}, document.title);

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

	// receive a connection signal from the server
	useEffect(() => {
		const newSocket = io('http://localhost:3000/pong');
		setSocket(newSocket);
		newSocket.on('connect', () => {
			newSocket.emit('connection', userCtx.user?.id);
		});

		return () => {
			newSocket.close();
		}
	}, [setSocket, userCtx.user?.id]);

	if (!userId || !userName || !socket) {
		return (
			<></>
		);
	}

	return (
		<div className={classes.gamePage}>
			{(isSpectator) && (
				<SpectatorBoard
					socket={socket}
					userId={userId}
					playerId={playerId}
					opponentId={opponentId}
					gameRoom={gameRoom}
				/>
			)}
			{(!isSpectator) && (
				<Pong
					socket={socket}
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
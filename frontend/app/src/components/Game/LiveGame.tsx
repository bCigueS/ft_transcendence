import React, { useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Game/Livegame.module.scss';
import { UserContext, UserLiveGames } from '../../store/users-contexte';
import LiveGameCard from './LiveGameCard';
import { Socket, io } from 'socket.io-client';

const Livegame: React.FC = () => {
	const [liveGames, setLiveGames] = useState<UserLiveGames[]>([]);
	const [socket, setSocket] = useState<Socket>();
	const userCtx = useContext(UserContext);

	useEffect(() => {
		const newSocket = io('http://localhost:3000/');
		setSocket(newSocket);
		newSocket.on('connect', () => {
			newSocket.emit('connection', userCtx.user?.id);
		});

		return () => {
			newSocket.close();
		}
	}, [setSocket, userCtx.user?.id]);

	useEffect(() => {
		const handleLiveGames = ({ liveMatchArray }: { liveMatchArray: UserLiveGames[] }) => {
			setLiveGames(liveMatchArray);
		}

		socket?.emit('getLiveGames');
		socket?.on('liveGames', handleLiveGames);

		return () => {
			socket?.off('liveGames', handleLiveGames);
		};

	}, [socket]);
	
	return (
		<div className={classes.container}>
			<h1>Live Games</h1>
			<div className={classes.matchs}>
				{
					liveGames.map((match, i) => (
						<LiveGameCard key={i} match={match}/>
					))
				}
			</div>
		</div>
	)
}

export default Livegame;

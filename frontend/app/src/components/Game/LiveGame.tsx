import React, { useCallback, useContext, useEffect, useState } from 'react';
import classes from '../../sass/components/Game/Livegame.module.scss';
import { UserAPI, UserContext, UserLiveGames } from '../../store/users-contexte';
import LiveGameCard from './LiveGameCard';
import { Socket, io } from 'socket.io-client';

const Livegame: React.FC = () => {
	const [liveGames, setLiveGames] = useState<UserLiveGames[]>([]);

	const socket = io('http://localhost:3000/', {
		transports: ["websocket"],
	});

	useEffect(() => {
		return () => {
			socket.removeAllListeners();
		}
	}, []);

	useEffect(() => {
		socket.emit('getLiveGames');
		socket.on('liveGames', ({ liveMatchArray }) => {
			console.log('received liveGames events, with array ', liveMatchArray);
			setLiveGames(liveMatchArray);
		});
	}, []);
	
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

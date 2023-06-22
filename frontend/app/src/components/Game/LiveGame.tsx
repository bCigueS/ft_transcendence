import React, { useCallback, useEffect, useState } from 'react';
import classes from '../../sass/components/Game/Livegame.module.scss';
import { UserAPI, UserLiveGames } from '../../store/users-contexte';
import LiveGameCard from './LiveGameCard';

// const DUMMY_MATCHS: UserMatch[] = [
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// 	{playerScore: 0, opponentScore: 0},
// ]

const Livegame: React.FC = () => {
	const [liveGames, setLiveGames] = useState<UserLiveGames[]>([]);

	const fetchUser = async(id: number) => {
		const response = await fetch('http://localhost:3000/users/' + id);
		if (!response.ok)
			throw new Error("Failed to fetch user");
		const data = await response.json();
		const user: UserAPI = {
			id: data.id,
			name: data.name,
			email: data.email,
			avatar: data.avatar,
			doubleAuth: data.doubleAuth,
			wins: data.wins
		}
		return user;
	}

	const parseMatchData = useCallback(async(match: any) => {

		const matchInfo: UserLiveGames = {
			player: await fetchUser(match.players[0].userId),
			opponent: await fetchUser(match.players[1].userId),
			gameRoom: match.room,
		}

		return matchInfo;
	}, []);

	const fetchLiveGames = useCallback(async() => {
		const response = await fetch('http://localhost:3000/games/0/liveGames');
		if (response.status === 404) {
			console.error("Error in fetch data");
			return ;
		}
		if (!response.ok)
			throw new Error("Failed to fetch live games");
		const data = await response.json();
		let matchArray: UserLiveGames[] = [];
	
		await Promise.all(data.map(async (match: UserLiveGames) => {
			const parsedMatch = await parseMatchData(match);
			matchArray = [...matchArray, parsedMatch];
		}));
	
		setLiveGames(matchArray);
	}, [parseMatchData]);

	useEffect(() => {
		fetchLiveGames();
	});
	
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

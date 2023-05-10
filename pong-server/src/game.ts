import { AddPlayerResult, PlayerInfo } from './types';

let beginnerLvl = 1;
let mediumLvl = 2;
let hardLvl = 3;

class Player {
	public name: string;
	public playerId: string;
	public level: string;
	public gameId: string;
	
	constructor(user: PlayerInfo) {
		this.name = user.name;
		this.playerId = user.playerId;
		this.level = user.level;
		this.gameId = user.gameId
	}
};

const games: Record<string, Player[]> = {};

const game = (id: string): Player[] => { return games[id] };

const addPlayer = (user: PlayerInfo): AddPlayerResult => {
	if (user.level === 'beginner') {
		user.gameId += beginnerLvl;
	} else if (user.level === 'medium') {
		user.gameId += mediumLvl;
	} else if (user.level === 'hard') {
		user.gameId += hardLvl;
	}
	
	if (games[user.gameId] && games[user.gameId].length >= 2) {
		user.gameId = 'pong';
		if (user.level === 'beginner') {
			beginnerLvl += 3;
			user.gameId += beginnerLvl;
		} else if (user.level === "medium") {
			mediumLvl += 3;
			user.gameId += mediumLvl;
		} else if (user.level === "hard") {
			hardLvl += 3;
			user.gameId += hardLvl;
		}
	}

	if (!games[user.gameId]) {
		const player = new Player(user);
		games[user.gameId] = [player];
		return {
			player,
			opponent: null,
			message: 'Created game room ' + user.gameId + ' on ' + user.level + ' level successfully, please wait for other player to join',
		};
	}

	const opponent = games[user.gameId][0];
	const player = new Player(user);
	games[user.gameId].push(player);
	return {
		player,
		opponent,
		message: 'Joined game room ' + user.gameId + ' on ' + user.level + ' level successfully',
	}
};

const removePlayer = (playerId: string) => {
	for (const game in games) {
		let players = games[game];
		const index = players.findIndex((pl: Player) => pl.playerId === playerId);
		
		if (index !== -1) {
			return players.splice(index, 1)[0];
		}
	}
};

export { addPlayer, game, removePlayer };
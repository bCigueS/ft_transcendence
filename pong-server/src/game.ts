import { AddPlayerResult, RemovePlayerResult, PlayerInfo, GameInfo, BallInfo } from './types';

let beginnerLvl = 1;
let mediumLvl = 2;
let hardLvl = 3;

class Player {
	public name: string;
	public playerId: string;
	public level: number;
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
	if (user.level === 0) {
		user.gameId += beginnerLvl;
	} else if (user.level === 1) {
		user.gameId += mediumLvl;
	} else if (user.level === 2) {
		user.gameId += hardLvl;
	}
	
	if (games[user.gameId] && games[user.gameId].length >= 2) {
		user.gameId = 'pong';
		if (user.level === 0) {
			beginnerLvl += 3;
			user.gameId += beginnerLvl;
		} else if (user.level === 1) {
			mediumLvl += 3;
			user.gameId += mediumLvl;
		} else if (user.level === 2) {
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

const removePlayer = (playerId: string, gameId?: string): RemovePlayerResult => {
	if (gameId) {
		let players = games[gameId];
		const index = players.findIndex((pl: Player) => pl.playerId === playerId);
		
		if (index !== -1) {
			return {
				player: players.splice(index, 1)[0],
				message: 'Player successfully removed from ' + gameId,
			}
		}
	} else {
		for (const id in games) {
			let players = games[id];
			const index = players.findIndex((pl: Player) => pl.playerId === playerId);
			
			if (index !== -1) {
				return {
					player: players.splice(index, 1)[0],
					message: 'Player successfully removed from ' + id,
				}
			}
		}
	}

	return {
		player: null,
		message: 'Cannot find player in ' + (gameId ? gameId : 'any existing gameId'),
	}

};

let dx = 0;
let dy = 0;

const serveBall = (info: GameInfo): BallInfo => {
	dx = (info.initialDelta + info.level);
	dy = 5 * (Math.random() * 2 - 1);

	console.log(dx, dy);
	return {dx, dy};
}

export { addPlayer, game, removePlayer, serveBall };
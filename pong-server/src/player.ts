import { AddPlayerResult, RemovePlayerResult, PlayerInfo } from './types';

// creating a starting room rumber for different game level
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

// an empty array of games to store all the game available
const games: Record<string, Player[]> = {};

const game = (id: string): Player[] => { return games[id] };

const addPlayer = (user: PlayerInfo): AddPlayerResult => {
	// give a gameId depending on the level of the player
	if (user.level === 0) {
		user.gameId += beginnerLvl;
	} else if (user.level === 1) {
		user.gameId += mediumLvl;
	} else if (user.level === 2) {
		user.gameId += hardLvl;
	}
	
	// if the gameId is already full (2 players per gameId) then assigned it to the next gameId that is a multiplication of 3, so that each level will not overlap
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

	// if the gameId is not used yet, create a new player and store it in the games array
	if (!games[user.gameId]) {
		const player = new Player(user);
		games[user.gameId] = [player];
		return {
			player,
			opponent: null,
			message: 'Created game room ' + user.gameId + ' on ' + user.level + ' level successfully, please wait for other player to join',
		};
	}

	// if the gameId is exist but not full yet, proceed by store a new player (second player) in this gameId, and assign first player as its opponent
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
	// if a gameId is provided in the parameter, then proceed by searching the player to be removed in this gameId
	if (gameId) {
		if (games[gameId]) {
			const index = games[gameId].findIndex((pl: Player) => pl.playerId === playerId);
			
			if (index !== -1) {
				// removed this player from the games array and return the address of this player
				return {
					player: games[gameId].splice(index, 1)[0],
					message: 'Player successfully removed from ' + gameId,
				}
			}
		}
	} else {
		// if a gameId is not provided then loop through the games array to search for the specific player
		for (const id in games) {
			if (games[id]) {
				const index = games[id].findIndex((pl: Player) => pl.playerId === playerId);
				
				if (index !== -1) {
					return {
						player: games[id].splice(index, 1)[0],
						message: 'Player successfully removed from ' + id,
					}
				}
			}
		}
	}

	return {
		player: null,
		message: 'Cannot find player in ' + (gameId ? gameId : 'any existing gameId'),
	}

};

export { addPlayer, game, removePlayer };
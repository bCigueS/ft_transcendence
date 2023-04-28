const games = {};

class Player {
	constructor(name, playerId, gameId) {
		this.name = name;
		this.playerId = playerId;
		this.gameId = gameId
	}
};

const addPlayer = ({ gameId, name, playerId }) => {
	if (!games[gameId]) {
		const player = new Player(name, playerId, gameId);
		games[gameId] = [player];
		return {
			message: 'Joined successfully',
			opponent: null,
			player,
		};
	}

	if (games[gameId].length >= 2) {
		return { error: 'This game is full' };
	}

	const opponent = games[gameId][0];
	const player = new Player(name, playerId, gameId);
	games[gameId].push(player);

	return {
		message: 'Added successfully',
		opponent,
		player,
	}
};

const removePlayer = (playerId) => {
	for (const game in games) {
		let players = games[game];
		const index = players.findIndex((pl) => pl.playerId === playerId);
		
		if (index !== -1) {
			return players.splice(index, 1)[0];
		}
	}
};

const game = (id) => games[id];

module.exports = {
	addPlayer,
	game,
	removePlayer,
}
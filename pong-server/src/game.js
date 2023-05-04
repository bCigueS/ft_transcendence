const games = {};

class Player {
	constructor(name, playerId, level, gameId) {
		this.name = name;
		this.playerId = playerId;
		this.level = level;
		this.gameId = gameId
	}
};

const game = (id) => games[id];

const addPlayer = ({ name, playerId, level, gameId }) => {
	if (!games[gameId]) {
		const player = new Player(name, playerId, level, gameId);
		games[gameId] = [player];
		return {
			player,
			opponent: null,
			message: 'Created game room ' + gameId + ' on ' + level + ' level successfully, please wait for other player to join',
		};
	}

	if (games[gameId].length >= 2) {
		return { full: 'This game room is full' };
	}

	if (games[gameId] && games[gameId][0] && games[gameId][0].level === level)
	{
		const opponent = games[gameId][0];
		const player = new Player(name, playerId, level, gameId);
		games[gameId].push(player);

		return {
			message: 'Joined game room ' + gameId + ' on ' + level + ' level successfully',
			opponent,
			player,
		}
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

module.exports = {
	addPlayer,
	game,
	removePlayer,
}

// export { addPlayer, game, removePlayer }
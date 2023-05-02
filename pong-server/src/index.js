const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { game, addPlayer, removePlayer } = require('./game');

const PORT = 3001;
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});


io.on('connection', (socket) => {
	socket.on('join', ({ name, level, gameId }, callback) => {
		const { error, player, opponent } = addPlayer({
			name,
			playerId: socket.id,
			level,
			gameId,
		});
		if (error) {
			return callback({ error });
		}
		socket.join(gameId);
		
		// send welcome message to player1, and also send the opponent player's data
		socket.emit('welcome', {
			message: `Hello ${player.name}, Welcome to the game`,
			opponent,
		});
		
		// tell player2 that player1 has joined the game
		socket.broadcast.to(player.gameId).emit('opponentJoin', {
			message: `${player.name} has joined the game`,
			opponent: player,
		});
		
		if (game(gameId).length >= 2) {
			io.to(gameId).emit('message', {
				message: `Let's start the game!`,
			});
		}
	});
	
	socket.on('move', ({ from, to, gameId }) => {
		socket.broadcast.to(gameId).emit('opponentMove', { from, to });
	});

	socket.on('disconnect', () => {
		const player = removePlayer(socket.id);

		if (player) {
			io.to(player.game).emit('message', {
				message: `${player.name} has left the game`,
			});
			socket.broadcast.to(player.game).emit('opponentLeft');
		}
	});
});

server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});

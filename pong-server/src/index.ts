import { game, addPlayer, removePlayer} from './game';
import { CallbackInfo } from './types';

const http = require ('http');
const { Server, Socket } = require('socket.io');
const express = require('express');
const cors = require('cors');

const PORT = 3001;
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

io.on('connection', (socket: typeof Socket) => {
	socket.on('join', ({ name, level }: { name: string, level: string }, callback: CallbackInfo) => {
		const {player, opponent, message} = addPlayer({
			name,
			playerId: socket.id,
			level,
			gameId: 'pong',
		});
		socket.join(player.gameId);
		callback(message);

		// send welcome message to player1, and also send the opponent player's data
		socket.emit('welcome', {
			message: `Hello ${player.name}, Welcome to the game`,
			opponent,
			gameId: player.gameId,
		});
		
		// tell player1 that player2 has joined the game
		socket.broadcast.to(player.gameId).emit('opponentJoin', {
			message: `${player.name} has joined the game`,
			opponent: player,
		});
		
		if (game(player.gameId).length >= 2) {
			io.to(player.gameId).emit('startGame', {
				message: `Let's start the game!`,
			});
		}
	});
	
	socket.on('move', ({ y, gameId }: {y: number, gameId: string}) => {
		socket.broadcast.to(gameId).emit('paddleMove', { y });
	});

	socket.on('leave', (gameId: string, callback: CallbackInfo) => {
		const {player, message} = removePlayer(socket.id, gameId);

		if (player) {
			socket.broadcast.to(gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});

			socket.leave(gameId);
			callback(message);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});

	socket.on('disconnect', () => {
		const {player, message} = removePlayer(socket.id);

		if (player) {
			socket.broadcast.to(player.gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});
			io.to(player.gameId).emit('stopGame', {
				message: `Game has ended, you won!`,
			});

			socket.leave(player.gameId);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});
});

server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});

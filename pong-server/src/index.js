// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import { game, addPlayer, removePlayer} from './game';

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

let room = 1;

io.on('connection', (socket) => {
	socket.on('join', ({ name, level }, callback) => {
		const {player, opponent, message, full} = addPlayer({
			name,
			playerId: socket.id,
			level,
			gameId: room,
		});
		if (full) {
			room += 1;
			const {player, opponent, message, full} = addPlayer({
				name,
				playerId: socket.id,
				level,
				gameId: room,
			});
			socket.join(room);
			return callback({ message });
		}
		socket.join(room);
		callback({ message });

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
		
		if (game(room).length >= 2) {
			io.to(room).emit('startGame', {
				message: `Let's start the game!`,
			});
		}
	});
	
	socket.on('move', ({ y, gameId }) => {
		socket.broadcast.to(gameId).emit('paddleMove', { y });
	});

	socket.on('disconnect', () => {
		const player = removePlayer(socket.id);

		if (player) {
			socket.broadcast.to(player.gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});
			io.to(player.gameId).emit('stopGame', {
				message: `Game has ended, you won!`,
			});
		}
	});
});

server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});

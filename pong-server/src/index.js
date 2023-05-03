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

let ply = {};

io.on('connection', (socket) => {
	socket.on('newPlayer', data => {
		console.log("New client connected, with id: " + socket.id);
		ply[socket.id] = data;
		console.log("name of player: " + ply[socket.id].name + ", level: " + ply[socket.id].level + " , gameId: " + ply[socket.id].gameId);
		console.log("Current number of players: " + Object.keys(ply).length);
		console.log("players dictionary: ", ply);
		io.emit('updatePlayers', ply);
	})
	socket.on('disconnect', function() {
		delete ply[socket.id];
		console.log("Goodbye client with id " + socket.id);
		console.log("Current number of players: " + Object.keys(ply).length);
		io.emit('updatePlayers', ply);
	})
	// socket.on('join', ({ name, level, gameId }, callback) => {
	// 	const { player, opponent, error, lo ading } = addPlayer({
	// 		name,
	// 		playerId: socket.id,
	// 		level,
	// 		gameId,
	// 	});
	// 	if (error) {
	// 		return callback({ error });
	// 	}
	// 	socket.join(gameId);
	// 	callback({ loading: `Please wait for other player to join` });
		
	// 	// send welcome message to player1, and also send the opponent player's data
	// 	socket.emit('welcome', {
	// 		message: `Hello ${player.name}, Welcome to the game`,
	// 		opponent,
	// 	});
		
	// 	// tell player2 that player1 has joined the game
	// 	socket.broadcast.to(player.gameId).emit('opponentJoin', {
	// 		message: `${player.name} has joined the game`,
	// 		opponent: player,
	// 	});
		
	// 	if (game(gameId).length >= 2) {
	// 		io.to(gameId).emit('message', {
	// 			message: `Let's start the game!`,
	// 		});
	// 	}
	// });
	
	// socket.on('opponentMove', ({ y, gameId }) => {
	// 	socket.broadcast.to(gameId).emit('paddleMove', { y });
	// });

	// socket.on('disconnect', () => {
	// 	const player = removePlayer(socket.id);

	// 	if (player) {
	// 		io.to(player.playerId).emit('message', {
	// 			message: `${player.name} has left the game`,
	// 		});
	// 		socket.broadcast.to(player.playerId).emit('opponentLeft');
	// 	}
	// });
});

server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});

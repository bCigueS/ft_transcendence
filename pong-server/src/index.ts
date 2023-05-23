import { game, addPlayer, removePlayer } from './player';
import { CallbackInfo, ServeInfo, CollisionInfo } from './types';
import { serveBall, ballCollision } from './ball';

const http = require ('http');
const { Server, Socket } = require('socket.io');
const express = require('express');
const cors = require('cors');

// port is 3001 because port 3000 is already used
const PORT = 3001;
const app = express();
const server = http.createServer(app);

app.use(cors());

// creating a new server that connect to the origin address of localhost:3000
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

io.on('connection', (socket: typeof Socket) => {
	// receiving a join request with name and level as a parameter
	socket.on('join', ({ name, level }: { name: string, level: number }, callback: CallbackInfo) => {
		// creating a player with addPlayer function that put this new player inside a games array
		const {player, opponent, message} = addPlayer({
			name,
			playerId: socket.id,
			level,
			gameId: 'pong',
		});

		// joining a game room that the room id is the gameId of the player
		socket.join(player.gameId);
		// send a callback message informing the successfull join process
		callback(message);

		// send welcome message to player, and also send the opponent player's data (if any)
		socket.emit('welcome', {
			message: `Hello ${player.name}, Welcome to the game`,
			opponent,
			gameId: player.gameId,
		});
		
		// tell first player that second player has joined the game
		socket.broadcast.to(player.gameId).emit('opponentJoin', {
			message: `${player.name} has joined the game`,
			opponent: player,
		});
		
		// when the room already has 2 players, send a message to both players that they can start the game
		if (game(player.gameId).length >= 2) {
			io.to(player.gameId).emit('startGame', {
				message: `Let's start the game!`,
			});
		}
	});
	
	// receiving a startBall request to inform the server to start a calculation for the direction of the ball to the players
	socket.on('startBall', ({gameInfo, gameId}: {gameInfo: ServeInfo, gameId: string}) => {
		// creating direction of the ball for the start of the game with serveBall function
		const {dx, dy} = serveBall(gameInfo);

		// get the players in the room and send the ball direction to both players (horizontal direction is in reverse/mirror)
		let room = io.sockets.adapter.rooms.get(gameId);
		if (room) {
			for (let id = room.values(), val = null; val = id.next().value; ) {
				io.to(val).emit('ballServe', {
					dx: (val === socket.id ? dx : dx * -1),
					dy: dy,
				});
			}
		}
	});
	
	// receiving a ballCollision request to inform the server that the ball hit a paddle of the player and need a new ball direction
	socket.on('ballCollision', ({gameInfo, gameId}: {gameInfo: CollisionInfo, gameId: string}) => {
		// creating a new direction of the ball after it hit a player paddle with ballCollision function
		let {dx, dy} = ballCollision(gameInfo);

		// get the players in the room and send the new ball direction to both players (horizontal direction is in reverse/mirror)
		let room = io.sockets.adapter.rooms.get(gameId);
		if (room) {
			for (let id = room.values(), val = null; val = id.next().value; ) {
				io.to(val).emit('ballLaunch', {
					dx: (val === socket.id ? dx : dx * -1),
					dy: dy,
				});
			}
		}
	})
		
	// receiving a new position of the player paddle and send it to the other player (to sync the movement as an opponent movement)
	socket.on('moveInput', ({ y, gameId }: {y: number, gameId: string}) => {
		socket.broadcast.to(gameId).emit('paddleMove', { y });
	});

	// receiving a leave request, so that the player can be removed from the games array and room
	socket.on('leave', (gameId: string, callback: CallbackInfo) => {
		// removing a player with removePlayer function and return the address of the deleted player
		const {player, message} = removePlayer(socket.id, gameId);

		if (player) {
			// send message to the other player in the room (if any) that a player just left
			socket.broadcast.to(gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});

			// leave the game room
			socket.leave(gameId);
			// send a callback message informing the successfull process
			callback(message);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});

	// receiving a disconnect request, when a connection of a player disrupted
	socket.on('disconnect', () => {
		// removing a player with removePlayer function and return the address of the deleted player
		const {player, message} = removePlayer(socket.id);

		if (player) {
			// send message to the other player in the room (if any) that a player just left
			socket.broadcast.to(player.gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});
			// send an additional message to all player in the room to stop the game and make the player that still in the room as a winner of the recent game
			io.to(player.gameId).emit('stopGame', {
				message: `Game has ended, you won!`,
			});

			socket.leave(player.gameId);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});
});

server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});

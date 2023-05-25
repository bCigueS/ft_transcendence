import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { GamesService } from './games.service';

import { game, addPlayer, removePlayer } from './player';
import { CallbackInfo, ServeInfo, CollisionInfo } from './types';
import { serveBall, ballCollision } from './ball';

@WebSocketGateway({ namespace: '/pong' })
export class GamesGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(GamesGateway.name);

  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer() io: Namespace;
  @WebSocketServer() server: Server

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: Socket) {
	client.on('join', ({ name, level }: { name: string, level: number }, callback: CallbackInfo) => {
		// creating a player with addPlayer function that put this new player inside a games array
		const {player, opponent, message} = addPlayer({
			name,
			playerId: client.id,
			level,
			gameId: 'pong',
		});

		// joining a game room that the room id is the gameId of the player
		client.join(player.gameId);
		// send a callback message informing the successfull join process
		callback(message);

		// send welcome message to player, and also send the opponent player's data (if any)
		client.emit('welcome', {
			message: `Hello ${player.name}, Welcome to the game`,
			opponent,
			gameId: player.gameId,
		});
		
		// tell first player that second player has joined the game
		client.broadcast.to(player.gameId).emit('opponentJoin', {
			message: `${player.name} has joined the game`,
			opponent: player,
		});
		
		// when the room already has 2 players, send a message to both players that they can start the game
		if (game(player.gameId).length >= 2) {
			this.io.to(player.gameId).emit('startGame', {
				message: `Let's start the game!`,
			});
		}
	});

	// receiving a startBall request to inform the server to start a calculation for the direction of the ball to the players

	client.on('startBall', async ({gameInfo, gameId}: {gameInfo: ServeInfo, gameId: string}) => {
		// creating direction of the ball for the start of the game with serveBall function
		const {dx, dy} = serveBall(gameInfo);

		// get the players in the room and send the ball direction to both players (horizontal direction is in reverse/mirror)
		const rooms = await this.io.in(gameId).fetchSockets();

		if (rooms) {
			rooms.forEach((room) => {
				// Access the properties or perform operations on each socket
				this.io.to(room.id).emit('ballServe', {
					dx: (room.id === client.id ? dx : dx * -1),
					dy: dy,
				});
			});
		}
	});
	
	// receiving a ballCollision request to inform the server that the ball hit a paddle of the player and need a new ball direction
	client.on('ballCollision', async ({gameInfo, gameId}: {gameInfo: CollisionInfo, gameId: string}) => {
		// creating a new direction of the ball after it hit a player paddle with ballCollision function
		let {dx, dy} = ballCollision(gameInfo);

		// get the players in the room and send the new ball direction to both players (horizontal direction is in reverse/mirror)
		const rooms = await this.io.in(gameId).fetchSockets();

		if (rooms) {
			rooms.forEach((room) => {
				// Access the properties or perform operations on each socket
				this.io.to(room.id).emit('ballLaunch', {
					dx: (room.id === client.id ? dx : dx * -1),
					dy: dy,
				});
			});
		}
	})
		
	// receiving a new position of the player paddle and send it to the other player (to sync the movement as an opponent movement)
	client.on('moveInput', ({ y, gameId }: {y: number, gameId: string}) => {
		client.broadcast.to(gameId).emit('paddleMove', { y });
	});

	// receiving a leave request, so that the player can be removed from the games array and room
	client.on('leave', (gameId: string, callback: CallbackInfo) => {
		// removing a player with removePlayer function and return the address of the deleted player
		const {player, message} = removePlayer(client.id, gameId);
  
		if (player) {
			// send message to the other player in the room (if any) that a player just left
			client.broadcast.to(gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});
  
			// leave the game room
			client.leave(gameId);
			// send a callback message informing the successfull process
			callback(message);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});
  
	// receiving a disconnect request, when a connection of a player disrupted
	client.on('disconnect', () => {
		// removing a player with removePlayer function and return the address of the deleted player
		const {player, message} = removePlayer(client.id);
  
		if (player) {
			// send message to the other player in the room (if any) that a player just left
			client.broadcast.to(player.gameId).emit('opponentLeft', {
				message: `${player.name} has left the game`,
			});
			// send an additional message to all player in the room to stop the game and make the player that still in the room as a winner of the recent game
			this.io.to(player.gameId).emit('stopGame', {
				message: `Game has ended, you won!`,
			});
  
			client.leave(player.gameId);
			// console.log('length of game: ' + game(player.gameId).length);
		}
	});
  }


//   @SubscribeMessage('join')
//   async handleJoinEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
//     console.log('Received message from client:', data);
// 	// const obj2 = JSON.parse(data);
// 	const obj = {
// 		name: 'Fany',
// 		level: 2
// 	};
// 	const name = obj.name;
// 	const level = obj.level;


// 	// creating a player with addPlayer function that put this new player inside a games array
// 	const {player, opponent, message} = addPlayer({
// 		name,
// 		playerId: socket.id,
// 		level,
// 		gameId: 'pong',
// 	});

// 	// joining a game room that the room id is the gameId of the player
// 	socket.join(player.gameId);
// 	// send a callback message informing the successfull join process
// 	// callback(message);

// 	// send welcome message to player, and also send the opponent player's data (if any)
// 	socket.emit('welcome', {
// 		message: `Hello ${player.name}, Welcome to the game`,
// 		opponent,
// 		gameId: player.gameId,
// 	});
	
// 	// tell first player that second player has joined the game
// 	socket.broadcast.to(player.gameId).emit('opponentJoin', {
// 		message: `${player.name} has joined the game`,
// 		opponent: player,
// 	});
	
// 	// // when the room already has 2 players, send a message to both players that they can start the game
// 	// if (game(player.gameId).length >= 2) {
// 	// 	io.to(player.gameId).emit('startGame', {
// 	// 		message: `Let's start the game!`,
// 	// 	});
// 	// }


//     // Sending a response to the client
//     socket.emit('response', 'Hello, client!');
//   }
}

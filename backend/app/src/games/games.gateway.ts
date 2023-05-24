import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GamesService } from './games.service';

import { game, addPlayer, removePlayer } from './player';
import { CallbackInfo, ServeInfo, CollisionInfo } from './types';
import { serveBall, ballCollision } from './ball';

@WebSocketGateway({ namespace: '/pong' })
export class GamesGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(GamesGateway.name);

  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer()
  server: Server

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection() {
    console.log('socket connected');
  }

  @SubscribeMessage('join')
  async handleJoinEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
    console.log('Received message from client:', data);
	// const obj2 = JSON.parse(data);
	const obj = {
		name: 'Fany',
		level: 2
	};
	const name = obj.name;
	const level = obj.level;


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
	// callback(message);

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
	
	// // when the room already has 2 players, send a message to both players that they can start the game
	// if (game(player.gameId).length >= 2) {
	// 	io.to(player.gameId).emit('startGame', {
	// 		message: `Let's start the game!`,
	// 	});
	// }


    // Sending a response to the client
    socket.emit('response', 'Hello, client!');
  }
}

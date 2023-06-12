import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';

import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameEntity } from './entities/game.entity';
import { UsersService } from '../users/users.service';

import { ServeInfo, CollisionInfo, GameOverInfo } from './utils/types';
import { GameState } from '@prisma/client';

@WebSocketGateway({ namespace: '/pong' })
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(GamesGateway.name);

	constructor(private readonly gamesService: GamesService, private prisma: PrismaService) {}

	@WebSocketServer() io: Namespace;
	@WebSocketServer() server: Server

	// Gateway initialized (provided in module and instantiated)
	afterInit(): void {
	this.logger.log(`Websocket Gateway initialized.`);
	}

	// Receive connection from client
	@SubscribeMessage('connection')
	async handleConnection() {
		console.log('a player is connected');
	}

	// receive join game request from client
	@SubscribeMessage('join')
	async handleJoinEvent(
		@MessageBody() { id, lvl, gameRoom }: { id: number, lvl: number, gameRoom?: string },
		@ConnectedSocket() client: Socket,
		) {
			let game, player, opponent;

			if (!gameRoom) {
				// find all existing games with state "PENDING" and level === lvl
				const matchingGames = await this.prisma.game.findMany({ 
					where: {
						state: GameState.PENDING,
						level: lvl,
					},
				});

				// update this game by adding a new UserGame with id of user sent change state playing
				if (matchingGames && matchingGames[0])
				{
					const updatedGameDto: UpdateGameDto = {
						state: GameState.PLAYING, // PLAYING
						players: [
							{
								userId: id,
							},
						],
					};
					updatedGameDto.socketIds.push(client.id);

					game = await this.gamesService.addPlayer(matchingGames[0].id, updatedGameDto);
				}

				// if no player in pending game state with same level has been found, we create a new game
				const createGameDto: CreateGameDto = {
					state: GameState.PENDING,
					level: lvl,
					players: [
						{
							userId: id,
						},
					],
					socketIds: [client.id],
				};
			
				game = await this.gamesService.create(createGameDto);
				game = await this.gamesService.assignRoom(game.id, 'pong' + game.id);

			} else {
				// if gameRoom is provided, then find the game based on the gameRoom
				game = await this.prisma.game.findUnique({
					where: { room: gameRoom }
				});

				const updatedGameDto: UpdateGameDto = {
					state: GameState.PLAYING, // PLAYING
					players: [
						{
							userId: id,
						},
					],
				};
				updatedGameDto.socketIds.push(client.id);

				game = await this.gamesService.addPlayer(game.id, updatedGameDto);
			}
			// join a gameRoom
			client.join(game.room);

			console.log('Succeed joining the room');

			player = await this.prisma.user.findUnique({
				where: { id: id },
			  });

			// send welcome message to player, and also send the opponent player's data (if any)
			client.emit('welcome', {
				message: `Hello ${player.name}, Welcome to the game`,
				opponent,
				gameRoom: game.room,
			});
		
			// tell first player that second player has joined the game
			client.broadcast.to(game.room).emit('opponentJoin', {
				message: `${player.name} has joined the game`,
				opponent: player,
			});

			// when the room already has 2 players, send a message to both players that they can start the game
			if ((game.players ?? []).length >= 2) {
				this.io.to(game.room).emit('startGame', {
					message: `Let's start the game!`,
				});
			}
	}

	// receiving a startBall request to inform the server to start a calculation for the direction of the ball to the players
	@SubscribeMessage('startBall')
	async handleStartBallEvent(
		@MessageBody() { gameInfo, gameRoom }: { gameInfo: ServeInfo, gameRoom: string },
		@ConnectedSocket() client: Socket,
		) {
			// creating direction of the ball for the start of the game
			const dx = (gameInfo.initialDelta + gameInfo.level);
			const dy = 5 * (Math.random() * 2 - 1);

			// get the players in the room and send the ball direction to both players (horizontal direction is in reverse/mirror)
			const rooms = await this.io.in(gameRoom).fetchSockets();

			if (rooms) {
				rooms.forEach((room) => {
					// Access the properties or perform operations on each socket
					this.io.to(room.id).emit('ballServe', {
						dx: (room.id === client.id ? dx : dx * -1),
						dy: dy,
					});
				});
			}
	}

	// receiving a ballCollision request to inform the server that the ball hit a paddle of the player and need a new ball direction
	@SubscribeMessage('ballCollision')
	async handleBallCollisionEvent(
		@MessageBody() { gameInfo, gameRoom }: { gameInfo: CollisionInfo, gameRoom: string },
		@ConnectedSocket() client: Socket,
		) {
			// creating a new direction of the ball after it hit a player paddle with ballCollision function

			// the area of the paddle where the ball hits (top/middle/bottom) affect the calculation of the new direction
			let collisionPoint = (gameInfo.y + (gameInfo.r / 2)) - (gameInfo.squareY + (gameInfo.squareHeight / 2));
			collisionPoint = collisionPoint / (gameInfo.squareHeight / 2);

			const angle = (Math.PI / 4) * collisionPoint;

			const dx = gameInfo.speed * Math.cos(angle);
			const dy = gameInfo.speed * Math.sin(angle);

			// get the players in the room and send the ball direction to both players (horizontal direction is in reverse/mirror)
			const rooms = await this.io.in(gameRoom).fetchSockets();

			if (rooms) {
				rooms.forEach((room) => {
					// Access the properties or perform operations on each socket
					this.io.to(room.id).emit('ballLaunch', {
						dx: (room.id === client.id ? dx : dx * -1),
						dy: dy,
					});
				});
			}
	}

	// receiving a new position of the player paddle and send it to the other player (to sync the movement as an opponent movement)
	@SubscribeMessage('moveInput')
	async handleMoveInputEvent(
		@MessageBody() { y, gameRoom }: { y: number, gameRoom: string },
		@ConnectedSocket() client: Socket,
		) {
			client.broadcast.to(gameRoom).emit('paddleMove', { y });
	}

	// receiving a leave request, so that the player can be removed from the games array and room
	@SubscribeMessage('gameOver')
	async handleGameOverEvent(
		@MessageBody() { gameInfo, gameRoom }: { gameInfo: GameOverInfo, gameRoom: string },
		@ConnectedSocket() client: Socket,
		) {
			console.log('received the disconnect signal');

			let game = await this.prisma.game.findUnique({
				where: { room: gameRoom },
			});

			// change status of the game to FINISHED
			game = await this.gamesService.gameOver(game.id, GameState.FINISHED);

			// assign the winnerId in the game
			if (gameInfo.playerStatus === "win") {
				game = await this.gamesService.assignWinner(game.id, gameInfo.playerId);
			}

			// update the userGame with the score
			const playerUser = await this.prisma.userGame.update({
				where: { userId_gameId: {
					userId: gameInfo.playerId, gameId: game.id
				}},
				data: { score: gameInfo.playerScore },
			});

			// if the game is ended because of disconnection of one party, the other party store the score of the opponent as well
			if (gameInfo.playerStatus === "win" && gameInfo.winnerScore !== gameInfo.playerScore) {
					const currentGame = await this.prisma.game.findUnique({
					where: { room: gameRoom },
					include: { players: true }
				});
	
				let opponentId: number | undefined;
				if ((currentGame.players ?? []).length === 2) {
					opponentId = currentGame.players.find(p => p.userId !== gameInfo.playerId)?.userId;
				}

				if (opponentId) {
					const opponentUser = await this.prisma.userGame.update({
						where: { userId_gameId: {
							userId: opponentId, gameId: game.id
						}},
						data: { score: gameInfo.opponentScore },
					});
				}
			}

			// send message to the other player in the room (if any) that a player just left
			client.broadcast.to(game.room).emit('opponentLeft', {
				message: `your opponent has left the game`,
			});

			// send an additional message to all player in the room to stop the game and make the player that still in the room as a winner of the recent game
			this.io.to(game.room).emit('stopGame', {
				message: `Game has ended!`,
			});

			// leave the gameRoom
			client.leave(game.room);
	}

	// receiving a disconnect request, when a connection of a player disrupted
	@SubscribeMessage('disconnect')
	async handleDisconnect(
		@ConnectedSocket() client: Socket,
		) {
			console.log('a player is disconnected');

			// get the the game that is not FINISHED and has the same socketIds with the client
			let currentGame = await this.prisma.game.findFirst({
				where: {
					state: {
						in: [GameState.PENDING, GameState.PLAYING],
					},
					socketIds: {
						has: client.id,
					}
				}
			});

			// if the player is already inside a game
			if (currentGame) {
				// send message to the other player in the room (if any) that a player just left
				client.broadcast.to(currentGame.room).emit('opponentLeft', {
					message: `your opponent has left the game`,
				});
				
				// send an additional message to all player in the room to stop the game and make the player that still in the room as a winner of the recent game
				this.io.to(currentGame.room).emit('stopGame', {
					message: `Game has ended, you won!`,
				});
				
				// leave the gameRoom
				client.leave(currentGame.room);

				if (currentGame.state === GameState.PLAYING) {
					// change status of the game to finished
					console.log('change the state of the game');
					currentGame = await this.gamesService.gameOver(currentGame.id, GameState.FINISHED);
				} else {
					// if game.state is still PENDING, delete the game from database
					console.log('delete the curent game from database');
					await this.gamesService.remove(currentGame.id);
				}
			}

	}
}

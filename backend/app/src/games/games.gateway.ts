import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';

import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameEntity } from './entities/game.entity';
import { UsersService } from '../users/users.service';

import { ServeInfo, CollisionInfo, GameOverInfo, CallbackInfo } from './utils/types';
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

	// async handleConnection(client: Socket) {
	// 	client.on('join', async({ id, lvl, gameRoom }: { id: number, lvl: number, gameRoom?: string }, callback: CallbackInfo) => {
	// 		let game, player, opponent, message;

	// 		if (!gameRoom) {
	// 			// find all existing games with state "PENDING" and level === lvl
	// 			const matchingGames = await this.prisma.game.findMany({ 
	// 				where: {
	// 					state: GameState.PENDING,
	// 					level: lvl,
	// 				},
	// 			});
		
	// 			// update this game by adding a new UserGame with id of user sent change state playing
	// 			if (matchingGames && matchingGames[0])
	// 			{
	// 				const updatedGameDto: UpdateGameDto = {
	// 					state: GameState.PLAYING, // PLAYING
	// 					players: [
	// 						{
	// 							userId: id,
	// 						},
	// 					],
	// 				};
		
	// 				game = await this.gamesService.addPlayer(matchingGames[0].id, updatedGameDto);
	// 			}
		
	// 			// if no player in pending game state with same level has been found, we create a new game
	// 			const createGameDto: CreateGameDto = {
	// 				state: GameState.PENDING,
	// 				level: lvl,
	// 				players: [
	// 					{
	// 						userId: id,
	// 					},
	// 				],
	// 			};
			
	// 			game = await this.gamesService.create(createGameDto);
	// 			game = await this.gamesService.assignRoom(game.id, 'pong' + game.id);
		
	// 		} else {
	// 			game = await this.prisma.game.findUnique({
	// 				where: { room: gameRoom }
	// 			});

	// 			const updatedGameDto: UpdateGameDto = {
	// 				state: GameState.PLAYING, // PLAYING
	// 				players: [
	// 					{
	// 						userId: id,
	// 					},
	// 				],
	// 			};

	// 			game = await this.gamesService.update(game.id, updatedGameDto);
	// 		}
	// 		client.join(game.room);
	// 		// send a callback message informing the successfull join process
	// 		callback(message);

	// 		player = await this.prisma.user.findUnique({
	// 			where: { id: id },
	// 		});

	// 		// send welcome message to player, and also send the opponent player's data (if any)
	// 		client.emit('welcome', {
	// 			message: `Hello ${player.name}, Welcome to the game`,
	// 			opponent,
	// 			gameRoom: game.room,
	// 		});

	// 		// tell first player that second player has joined the game
	// 		client.broadcast.to(game.room).emit('opponentJoin', {
	// 			message: `${player.name} has joined the game`,
	// 			opponent: player,
	// 		});
			
	// 		// when the room already has 2 players, send a message to both players that they can start the game
	// 		const numberOfPlayers = (game.players ?? []).length;
	// 		if (numberOfPlayers >= 2) {
	// 			this.io.to(game.room).emit('startGame', {
	// 				message: `Let's start the game!`,
	// 			});
	// 		}
	// 	});

	// 	// receiving a startBall request to inform the server to start a calculation for the direction of the ball to the players
	// 	client.on('startBall', async ({gameInfo, gameRoom}: {gameInfo: ServeInfo, gameRoom: string}) => {
	// 		// creating direction of the ball for the start of the game
	// 		const dx = (gameInfo.initialDelta + gameInfo.level);
	// 		const dy = 5 * (Math.random() * 2 - 1);

	// 		// get the players in the room and send the ball direction to both players (horizontal direction is in reverse/mirror)
	// 		const rooms = await this.io.in(gameRoom).fetchSockets();

	// 		if (rooms) {
	// 			rooms.forEach((room) => {
	// 				// Access the properties or perform operations on each socket
	// 				this.io.to(room.id).emit('ballServe', {
	// 					dx: (room.id === client.id ? dx : dx * -1),
	// 					dy: dy,
	// 				});
	// 			});
	// 		}
	// 	});
		
	// 	// receiving a ballCollision request to inform the server that the ball hit a paddle of the player and need a new ball direction
	// 	client.on('ballCollision', async ({gameInfo, gameRoom}: {gameInfo: CollisionInfo, gameRoom: string}) => {
	// 		// creating a new direction of the ball after it hit a player paddle with ballCollision function

	// 		// the area of the paddle where the ball hits (top/middle/bottom) affect the calculation of the new direction
	// 		let collisionPoint = (gameInfo.y + (gameInfo.r / 2)) - (gameInfo.playerY + (gameInfo.paddleHeight / 2));
	// 		collisionPoint = collisionPoint / (gameInfo.paddleHeight / 2);

	// 		const angle = (Math.PI / 4) * collisionPoint;

	// 		const dx = gameInfo.speed * Math.cos(angle);
	// 		const dy = gameInfo.speed * Math.sin(angle);


	// 		// get the players in the room and send the new ball direction to both players (horizontal direction is in reverse/mirror)
	// 		const rooms = await this.io.in(gameRoom).fetchSockets();

	// 		if (rooms) {
	// 			rooms.forEach((room) => {
	// 				// Access the properties or perform operations on each socket
	// 				this.io.to(room.id).emit('ballLaunch', {
	// 					dx: (room.id === client.id ? dx : dx * -1),
	// 					dy: dy,
	// 				});
	// 			});
	// 		}
	// 	})
			
	// 	// receiving a new position of the player paddle and send it to the other player (to sync the movement as an opponent movement)
	// 	client.on('moveInput', ({ y, gameRoom }: {y: number, gameRoom: string}) => {
	// 		client.broadcast.to(gameRoom).emit('paddleMove', { y });
	// 	});

	// 	// receiving a leave request, so that the player can be removed from the games array and room
	// 	client.on('gameOver', async ({gameRoom, status, playerScore, opponentScore}
	// 		: {gameRoom: string, status: string, playerScore: number, opponentScore: number}
	// 		, callback: CallbackInfo) => {
	// 			// const rooms = await this.io.in(gameRoom).fetchSockets();

	// 			// if (rooms) {
	// 			// 	rooms.forEach((room) => {
	// 			// 		let winnerId;
	// 			// 		if (room.id !== client.id) {
	// 			// 			winnerId: (status === "win" ? client.id : room.id);
	// 			// 		}
	// 			// 	})
	// 			// }

	// 			// removing a player with removePlayer function and return the address of the deleted player
	// 			// const {player, message} = removePlayer(client.id, gameRoom);
		
	// 			// if (player) {
	// 			// 	// send message to the other player in the room (if any) that a player just left
	// 			// 	client.broadcast.to(gameRoom).emit('opponentLeft', {
	// 			// 		message: `${player.name} has left the game`,
	// 			// 	});
		
	// 			// 	// leave the game room
	// 			// 	client.leave(gameRoom);
	// 			// 	// send a callback message informing the successfull process
	// 			// 	callback(message);
	// 			// 	// console.log('length of game: ' + game(player.gameRoom).length);
	// 			// }
	// 	});
	
	// 	// receiving a disconnect request, when a connection of a player disrupted
	// 	client.on('disconnect', () => {
	// 		// // removing a player with removePlayer function and return the address of the deleted player
	// 		// const {player, message} = removePlayer(client.id);SubscribeMessage
	// 		// 	});
	
	// 		// 	client.leave(player.gameRoom);
	// 		// 	// console.log('length of game: ' + game(player.gameRoom).length);
	// 		// }
	// 		console.log('a player has disonnected');
	// 	});
	// }

	@SubscribeMessage('connection')
	async handleConnection() {
		console.log('a player is connected');
	}


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

				game = await this.gamesService.update(game.id, updatedGameDto);
			}
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
			
			const numberOfPlayers = (game.players ?? []).length;
			// when the room already has 2 players, send a message to both players that they can start the game
			if (numberOfPlayers >= 2) {
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
			let collisionPoint = (gameInfo.y + (gameInfo.r / 2)) - (gameInfo.playerY + (gameInfo.paddleHeight / 2));
			collisionPoint = collisionPoint / (gameInfo.paddleHeight / 2);

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

	@SubscribeMessage('gameOver')
	async handleGameOverEvent(
		@MessageBody() { gameInfo, gameRoom }: { gameInfo: GameOverInfo, gameRoom: string },
		@ConnectedSocket() client: Socket,
		) {
			console.log('received the disconnect signal');

			let game = await this.prisma.game.findUnique({
				where: { room: gameRoom },
			});

			// change status of the game
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

			client.leave(game.room);
	}

	@SubscribeMessage('disconnect')
	async handleDisconnect(
		@ConnectedSocket() client: Socket,
		) {
			console.log('a player is disconnected');

			let game = await this.prisma.game.findFirst({
				where: {
					socketIds: {
						has: client.id,
					}
				}
			});

			if (game) {
				// send message to the other player in the room (if any) that a player just left
				client.broadcast.to(game.room).emit('opponentLeft', {
					message: `your opponent has left the game`,
				});
				
				// send an additional message to all player in the room to stop the game and make the player that still in the room as a winner of the recent game
				this.io.to(game.room).emit('stopGame', {
					message: `Game has ended, you won!`,
				});
				
				client.leave(game.room);

				if (game.state === GameState.PLAYING) {
					// change status of the game
					game = await this.gamesService.gameOver(game.id, GameState.FINISHED);
				} else {
					// if game.state is still PENDING, delete the game from database
					await this.gamesService.remove(game.id);
				}
			}

	}
}

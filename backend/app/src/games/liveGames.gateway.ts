import { Logger, NotFoundException } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import EventEmitter from "events";
import { GamesService } from "./games.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Namespace, Server, Socket } from "socket.io";
import { LiveGamesInfo } from "./utils/types";
import { GamesGateway } from "./games.gateway";

@WebSocketGateway({ namespace: '/' })
export class LiveGamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(LiveGamesGateway.name);
	static eventEmitter: EventEmitter = new EventEmitter();

	constructor(private readonly gamesService: GamesService, private prisma: PrismaService) {}

	@WebSocketServer() io: Namespace;
	@WebSocketServer() server: Server

	// Gateway initialized (provided in module and instantiated)
	afterInit(
		@ConnectedSocket() client: Socket,
		): void {
		this.logger.log(`Websocket Gateway initialized.`);

		GamesGateway.eventEmitter.on('addLiveGame', async () => {
			this.handleGetLiveGameEvent(client);
		});

		GamesGateway.eventEmitter.on('removeLiveGame', async () => {
			this.handleGetLiveGameEvent(client);
		});
	}

	// Receive connection from client
	@SubscribeMessage('connection')
	async handleConnection(
		@ConnectedSocket() client: Socket,
		) {
		console.log('a user is connected in live games');
	}

	@SubscribeMessage('getLiveGames')
	async handleGetLiveGameEvent(
		@ConnectedSocket() client: Socket,
		) {
			const games = await this.gamesService.getLiveGames();

			if (games) {
				console.log('games is exist');
				let liveMatchArray: LiveGamesInfo[] = [];
	
				for (const game of games) {
					const [userPlayer, userOpponent] = game.players;
	
					const player = await this.prisma.user.findUnique({
						where: { id: userPlayer.userId },
					});
		
					const opponent = await this.prisma.user.findUnique({
						where: { id: userOpponent.userId },
					});
				
					liveMatchArray.push({
						player,
						opponent,
						gameRoom: game.room,
					});
				}
	
				console.log(liveMatchArray);
		
				client.emit('liveGames', ({ liveMatchArray }));
			}
		}	


	// Receive disconnection from client
	@SubscribeMessage('disconnect')
	async handleDisconnect(
		@ConnectedSocket() client: Socket,
		) {
		console.log('a user is disconnected in live games');
	}
}
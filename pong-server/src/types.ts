export type PlayerInfo = {
	name: string;
	playerId: string;
	level: number;
	gameId: string;
}

export type BallInfo = {
	// x: number;
	// y: number;
	dx: number;
	dy: number;
	// s: number;
}

export type AddPlayerResult = {
	player: PlayerInfo;
	opponent: PlayerInfo | null;
	message: string;
}

export type RemovePlayerResult = {
	player: PlayerInfo | null;
	message: string;
}

export type CallbackInfo = (message: string) => {
	message: string;
}

export type GameInfo = {
	// boardWidth: number;
	// boardHeight: number;
	// paddleWidth: number;
	// paddleHeight: number;
	// initialSpeed: number;
	initialDelta: number;
	// playerX: number;
	// opponentX: number;
	// winnerScore: number;
	level: number;
	// side: number;
}
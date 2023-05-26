export type PlayerInfo = {
	name: string;
	playerId: string;
	level: number;
	gameId: string;
}

export type BallInfo = {
	dx: number;
	dy: number;
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

export type ServeInfo = {
	initialDelta: number;
	level: number;
}

export type CollisionInfo = {
	y: number;
	r: number;
	playerY: number;
	paddleHeight: number;
	speed: number;
}
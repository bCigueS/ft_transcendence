export type ServeInfo = {
	initialDelta: number;
	level: number;
}

export type CollisionInfo = {
	y: number;
	r: number;
	squareY: number;
	squareHeight: number;
	speed: number;
}

export type GameOverInfo = {
	playerId: number;
	playerStatus: string;
	playerScore: number;
	opponentScore: number;
	winnerScore: number;
}
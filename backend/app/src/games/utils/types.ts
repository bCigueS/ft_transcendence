export type ServeInfo = {
	initialDelta: number;
	level: number;
}

export type CollisionInfo = {
	x: number;
	y: number;
	r: number;
	squareY: number;
	squareHeight: number;
	speed: number;
}

export type GameOverInfo = {
	playerId: number;
	playerScore: number;
	opponentScore: number;
}
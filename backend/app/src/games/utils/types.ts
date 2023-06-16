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
	middleBoard: number;
}

export type ScoreInfo = {
	playerScore: number;
	opponentScore: number;
}

export type GameOverInfo = {
	playerId: number;
	playerScore: number;
	opponentScore: number;
}

export type UpdatedInfo = {
	x: number;
	y: number;
	dx: number;
	dy:number;
	s: number;
	playerY: number;
	opponentY: number;
	pScore: number;
	oScore: number;
}
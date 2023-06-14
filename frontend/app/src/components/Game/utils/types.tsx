export type PongInfo = {
	boardWidth: number;
	boardHeight: number;
	paddleWidth: number;
	obstacleWidth: number;
	obstacleHeight: number;
	obstacleSpeed: number;
	initialSpeed: number;
	initialDelta: number;
	playerX: number;
	opponentX: number;
	obstacleX: number;
	winnerScore: number;
}

export type PongProp = {
	userId: number;
	userName: string;
}

export type SpectatorProp = {
	playerId: number;
	playerName: string;
	opponentId: number;
	opponentName: string;
}

export type BallInfo = {
	dx: number;
	dy: number;
	x: number;
	s: number;
}

export type CollisionInfo = {
	y: number;
	r: number;
	playerY: number;
	paddleHeight: number;
	speed: number;
}

export type LiveBoardProps = {
	isReady: boolean;
	playerName: string;
	opponentName: string;
	start(): void;
}

export interface State {
	time: number;
	seconds: number;
}

export type ModalProps = {
	buttonText: string;
	text: string;
	onStartPage(): void;
	onTool(mode: "keyboard" | "mouse"): void;
	onDifficulty(level: 0 | 1 | 2 | 3): void;
	onPlayerMode(mode: "single" | "double"): void;
}
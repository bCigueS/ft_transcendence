import { UserAPI } from "../../../store/users-contexte";

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
	// user: UserAPI;
	// opponent: UserAPI;
	inviteMode: boolean;
}

export type SpectatorProp = {
	mode: number;
	user: UserAPI;
	gameLevel: number;
	gameRoom: string;
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

export type BallInfo = {
	dx: number;
	dy: number;
	x: number;
	y: number;
	s: number;
}

export type CollisionInfo = {
	y: number;
	r: number;
	playerY: number;
	paddleHeight: number;
	ballSpeed: number;
}

export type LiveBoardProps = {
	isReady: boolean;
	playerName: string;
	opponentName: string;
	inviteMode: boolean;
	spectatorMode: boolean;
	closingText: string;
	start(): void;
}

export interface State {
	time: number;
	seconds: number;
}

export type ModalProps = {
	inviteMode: boolean;
	buttonText: string;
	closingText: string;
	onStartPage(): void;
	onTool(mode: "keyboard" | "mouse"): void;
	onDifficulty(level: 0 | 1 | 2 | 3): void;
	onPlayerMode(mode: "single" | "double"): void;
}

export type PausedProps = {
	mode: "spectator" | "play";
}
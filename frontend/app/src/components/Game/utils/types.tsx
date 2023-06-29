import { Socket } from "socket.io-client";
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
	socket: Socket;
	userId: number;
	userName: string;
	opponentId: number | undefined;
	gameRoom: string | undefined;
	inviteMode: boolean;
	isInvited: boolean;
}

export type SpectatorProp = {
	socket: Socket;
	userId: number;
	playerId: number;
	opponentId: number;
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
	isPaused: boolean;
	playerScreenTooSmall: boolean;
	opponentScreenTooSmall: boolean;
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
	playerName: string | undefined;
	opponentName: string | undefined;
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
	isInvited: boolean;
	buttonText: string;
	cancelText: string;
	closingText: string;
	onStartPage(): void;
	onRestart(): void;
	onTool(mode: "keyboard" | "mouse"): void;
	onDifficulty(level: 0 | 1 | 2 | 3): void;
	onPlayerMode(mode: "single" | "double" | ""): void;
}

export type PausedProps = {
	text: string;
}
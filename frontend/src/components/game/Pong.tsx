import { useState } from 'react';
import Canvas from '../Canvas';
import Ball from './Ball';
import Player from './Player';

type PongInfo = {
	boardWidth: number;
	boardHeight: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeed: number;
	ballSize: number;
	upArrow: number;
	downArrow: number;
}

export default function Pong() {
	
	const pongInfo: PongInfo = {
		boardWidth: 640,
		boardHeight: 440,
		paddleWidth: 10,
		paddleHeight: 80,
		paddleSpeed: 5,
		ballSize: 10,
		upArrow: 38,
		downArrow: 40,
	}
	
	// ball position
	const [ballX, setBallX] = useState(100);
	const [ballY, setBallY] = useState(100);
	// direction
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);
	// player position
	const [playerX, setPlayerX] = useState(10);
	const [playerY, setPlayerY] = useState((pongInfo.boardHeight - pongInfo.paddleHeight) / 2);
	// opponnent position
	const [opponentX, setOpponentX] = useState(pongInfo.boardWidth - pongInfo.paddleWidth - 10);
	const [opponentY, setOpponentY] = useState((pongInfo.boardHeight - pongInfo.paddleHeight) / 2);
	// score
	const [playerScore, setPlayerScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	// animation
	const [frameCount, setFrameCount] = useState(0);
	const [speed, setSpeed] = useState(30);
	// game over
	const [gameOver, setGameOver] = useState(false);

	const outerGround = {
		margin: "50px",
		borderRadius: "40px",
		display: "inline-block",
		width: "860px",
		height: "660px",
		backgroundColor: "#EBB6A9",
		alignItems: "center",
	}

	const innerGround = {
		margin: "100px 100px",
		display: "inline-block",
		width: "660px",
		height: "460px",
		backgroundColor: "#6EB0D9",
		alignItems: "center",
		border: "10px solid #F5F2E9",
		zIndex: "1",
	}

	const dividerLine = {
		margin: "0px 430px",
		width: "15px",
		height: "660px",
		backgroundColor: "#F5F2E9",
		position: "absolute" as "absolute",
		zIndex: "2",
	}

	const drawBoard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
		// draw background
		ctx.fillStyle = '#6EB0D9';
		ctx.fillRect(0, 0, pongInfo.boardWidth, pongInfo.boardHeight);
		ctx.save();

		// draw player
		ctx.fillStyle = '#F5F2E9';
		ctx.fillRect(playerX, playerY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		ctx.save();

		// draw opponent
		ctx.fillStyle = '#F5F2E9';
		ctx.fillRect(opponentX, opponentY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		ctx.save();
		
		// draw ball
		ctx.beginPath();
		ctx.arc(ballX, ballY, pongInfo.ballSize, 0, 2 * Math.PI);
		ctx.fill();
		ctx.lineWidth = 0;
		ctx.strokeStyle = '#F5F2E9';
		ctx.stroke();
		// draw score
		ctx.font = '42px Inter';
		ctx.fillText(' ' + playerScore, 250, 50);
		ctx.fillText(' ' + opponentScore, 355, 50);
	}
	
	return (
		<div style={outerGround} className="outer_ground">
			<div style={dividerLine} className="divider_line"></div>
			<div style={innerGround} className="inner_ground">
				<Canvas 
					draw={drawBoard} 
					width={pongInfo.boardWidth}
					height={pongInfo.boardHeight}
				/>
			</div>
		</div>
	);

}
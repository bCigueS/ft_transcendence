import React, { useState, useRef, useEffect, useLayoutEffect, MouseEvent, KeyboardEvent } from 'react';
import '../../sass/main.scss';
import Modal from './Modal';

const KEYBOARD_MODE = "keyboard";
const MOUSE_MODE = "mouse";

const PLAYER_WIN = 3;
const OPPONENT_WIN = 4;

const PLAYER_SIDE = -1;
const OPPONENT_SIDE = 1;

const PLAYER_UP = "ArrowUp";
const PLAYER_DOWN = "ArrowDown";

const BEGINNER_LEVEL = "beginner";
const MEDIUM_LEVEL = "medium";
const HARD_LEVEL = "hard";

const SINGLE_MODE = "single";
const DOUBLE_MODE = "double";

type PongInfo = {
	boardWidth: number;
	boardHeight: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeed: number;
	ballRadius: number;
	winnerScore: number;
}

export default function Pong() {
	const pongInfo: PongInfo = {
		boardWidth: 640,
		boardHeight: 480,
		paddleWidth: 10,
		paddleHeight: 80,
		paddleSpeed: 5,
		ballRadius: 10,
		winnerScore: 3,
	}
	
	const angle = (Math.PI/ 4) + Math.random();
	// animation
	const [frameCount, setFrameCount] = useState(0);
	const [speed, setSpeed] = useState(10);
	// ball position
	const [ballX, setBallX] = useState(pongInfo.boardWidth / 2);
	const [ballY, setBallY] = useState(pongInfo.boardHeight / 2);
	// direction
	const [deltaX, setDeltaX] = useState(4); // speed * Math.cos(angle));
	const [deltaY, setDeltaY] = useState(4); // speed * Math.sin(angle));
	// player position
	const [playerX, setPlayerX] = useState(10);
	const [playerY, setPlayerY] = useState((pongInfo.boardHeight - pongInfo.paddleHeight) / 2);
	// opponnent position
	const [opponentX, setOpponentX] = useState(pongInfo.boardWidth - pongInfo.paddleWidth - 10);
	const [opponentY, setOpponentY] = useState((pongInfo.boardHeight - pongInfo.paddleHeight) / 2);
	// score
	const [playerScore, setPlayerScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	// game play
	const [isRunning, setIsRunning] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(0);
	const [toolMode, setToolMode] = useState(MOUSE_MODE);
	const [level, setLevel] = useState(BEGINNER_LEVEL);
	const [playerMode, setPlayerMode] = useState(SINGLE_MODE);
	// canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	
	const detectOpponentCollision = () => {
		if (ballX + pongInfo.ballRadius >= opponentX && ballY > opponentY && ballY < opponentY + pongInfo.paddleHeight) {
			setDeltaX(x => x *= -1);
			setBallX(x => x -= pongInfo.ballRadius);

			let collisionPoint = (ballY + (pongInfo.ballRadius / 2)) - (opponentY + (pongInfo.paddleHeight / 2));
			collisionPoint = collisionPoint / (pongInfo.paddleHeight / 2);

			let angle = (Math.PI / 4) * collisionPoint + Math.random();

			setDeltaX(-speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}

	const detectPlayerCollision = () => {
		if (ballX - pongInfo.ballRadius <= playerX && ballY > playerY && ballY < playerY + pongInfo.paddleHeight) {
			setBallX(x => x += pongInfo.ballRadius);

			let collisionPoint = (ballY + (pongInfo.ballRadius / 2)) - (playerY + (pongInfo.paddleHeight / 2));
			collisionPoint = collisionPoint / (pongInfo.paddleHeight / 2);

			let angle = (Math.PI / 4) * collisionPoint + Math.random();

			setDeltaX(speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}
	
	const serve = (side: number) => {

		setBallX(pongInfo.boardWidth / 2);
		setBallY(pongInfo.boardHeight / 2);

		setSpeed(5);
		
		setDeltaX(4 * side); // speed * Math.cos(angle) * side);
		setDeltaY(4); // speed * Math.sin(angle));
	}

	const restartGame = (side: number) => {
		if (gameOver) {
			setPlayerScore(0);
			setOpponentScore(0);
			setGameOver(false);
			setSpeed(3);
		}

		setIsRunning(true);
		serve(side);
	}
	
	const detectWallCollision = () => {
		const minY    = pongInfo.ballRadius;
		const maxY    = pongInfo.boardHeight - pongInfo.ballRadius;

		// top collision
		if (ballY < minY) {
			setDeltaY(y => y * -1);
			setBallY(minY);
		}
		// bottom collision
		if (ballY > maxY) {
			setDeltaY(y => y * -1);
			setBallY(maxY);
		}
		// left collision
		if (ballX <= 0)
		{
			setOpponentScore(o => o += 1);
			serve(PLAYER_SIDE);
		}
		//right collision
		if (ballX >= pongInfo.boardWidth)
		{
			setPlayerScore(p => p += 1);
			serve(OPPONENT_SIDE);	
		}
	}
	
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);

		const nextPos = ballY - (pongInfo.paddleHeight / 2) * 0.1;
		
		if (nextPos >= 0 && nextPos + pongInfo.paddleHeight <= pongInfo.boardHeight) {
			setOpponentY(nextPos); // to delete later
		}
	}
	
	const draw = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, pongInfo.boardWidth, pongInfo.boardHeight);
		// draw background
		context.fillStyle = '#4E6E81';
		context.fillRect(0, 0, pongInfo.boardWidth, pongInfo.boardHeight);
		context.save();
		// draw player
		context.fillStyle = '#F2F2F2';
		context.fillRect(playerX, playerY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		context.save();
		// draw opponent
		context.fillStyle = '#F2F2F2';
		context.fillRect(opponentX, opponentY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		context.save();
		// draw ball
		context.beginPath();
		context.arc(ballX, ballY, pongInfo.ballRadius, 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle = '#F2F2F2';
		context.stroke();
		// draw score
		context.font = '42px Inter';
		context.fillText(' ' + playerScore, 245, 50);
		context.fillText(' ' + opponentScore, 345, 50);
	}

	const handleMouseEvent = (event: MouseEvent<HTMLDivElement>) => {
		const nextPos = event.clientY - pongInfo.boardHeight + pongInfo.paddleHeight;

		if (toolMode === MOUSE_MODE 
			&& isRunning 
			&& nextPos >= 0 
			&& nextPos + pongInfo.paddleHeight <= pongInfo.boardHeight) {
			setPlayerY(nextPos);
		}
	}

	const handleKeyDownEvent = (event: KeyboardEvent<HTMLElement>) => {
		if (toolMode === KEYBOARD_MODE && isRunning)
		{
			const nextPostUp = playerY - 20;
			const nextPostDown = playerY + 20 + pongInfo.paddleHeight;
			if (event.code === PLAYER_UP && nextPostUp >= 0) {
				setPlayerY(y => y -= 20);
			}
			if (event.code === PLAYER_DOWN && nextPostDown <= pongInfo.boardHeight) {
				setPlayerY(y => y += 20);
			}
		}
	}

	// render game
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return;
		const context = canvas.getContext('2d');
		if (!context)
			return;

		draw(context);
		if (isRunning) {
			moveBall();
			detectWallCollision();
			detectPlayerCollision();
			detectOpponentCollision();
			// check game status
			if (opponentScore > pongInfo.winnerScore || playerScore > pongInfo.winnerScore) {
				playerScore > pongInfo.winnerScore ? setWinner(PLAYER_WIN) : setWinner(OPPONENT_WIN);
				setIsRunning(false);
				setGameOver(true);
			}
		}
			
	}, [frameCount])
	
	// update the frameCount
	useLayoutEffect(() => {
		let frameId: any;
		const render = () => {
			setFrameCount(fc => fc + 1);
			frameId = requestAnimationFrame(render);
		}
		render();

		return () => {window.cancelAnimationFrame(frameId);}
	}, [])

	return (
		<>
			{(!isRunning || gameOver) && (
				<Modal 
					buttonText={gameOver ? "Play again" : "Start playing"}
					text={winner === PLAYER_WIN ? "You wins!" : "You lose!"}
					onStartPage={() => restartGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE)}
					onTool={(mode) => {setToolMode(mode)}}
					onDifficulty={(level) => {setLevel(level)}}
					onPlayerMode={(mode) => {setPlayerMode(mode)}}
				/>
			)}
			<div className="outer_ground" onMouseMove={handleMouseEvent} onKeyDown={handleKeyDownEvent} tabIndex={0}>
				<div className="divider_line"></div>
				<div className="inner_ground">
					<canvas 
						ref={canvasRef}
						width={pongInfo.boardWidth}
						height={pongInfo.boardHeight}
					/>
				</div>
			</div>
		</>
	);
}
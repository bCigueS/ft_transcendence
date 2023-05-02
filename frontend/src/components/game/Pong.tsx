import React, { useState, useRef, useEffect, useLayoutEffect, MouseEvent, KeyboardEvent } from 'react';
import Modal from './Modal';
import '../../sass/main.scss';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Modal's element
const BEGINNER_LEVEL = "beginner";
const MEDIUM_LEVEL = "medium";
const HARD_LEVEL = "hard";

const KEYBOARD_MODE = "keyboard";
const MOUSE_MODE = "mouse";

const SINGLE_MODE = "single";
const DOUBLE_MODE = "double";

// Game's element
const PLAYER_WIN = -1;
const OPPONENT_WIN = 1;

const PLAYER_SIDE = -1;
const OPPONENT_SIDE = 1;

// type
type PongInfo = {
	boardWidth: number;
	boardHeight: number;
	paddleWidth: number;
	initialSpeed: number;
	playerX: number;
	opponentX: number;
	winnerScore: number;
}

export default function Pong() {
	const info: PongInfo = {
		boardWidth: 640,
		boardHeight: 480,
		paddleWidth: 10,
		initialSpeed: 5,
		playerX: 10,
		opponentX: 620, // boardWidth - paddleWidth - 10,
		winnerScore: 3,
	}
	
	const angle = (Math.PI/ 4) + Math.random();
	// game play
	const [isRunning, setIsRunning] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(0);
	// game mode
	const [toolMode, setToolMode] = useState(MOUSE_MODE);
	const [level, setLevel] = useState(BEGINNER_LEVEL);
	const [playerMode, setPlayerMode] = useState(SINGLE_MODE);
	// animation
	const [frameCount, setFrameCount] = useState(0);
	const [speed, setSpeed] = useState(info.initialSpeed);
	// ball info
	const [ballRadius, setBallRadius] = useState(10);
	const [ballX, setBallX] = useState(info.boardWidth / 2);
	const [ballY, setBallY] = useState(info.boardHeight / 2);
	// ball direction
	const [deltaX, setDeltaX] = useState(4); // speed * Math.cos(angle));
	const [deltaY, setDeltaY] = useState(4); // speed * Math.sin(angle));
	// players info
	const [paddleHeight, setPaddleHeight] = useState(120);
	const [playerY, setPlayerY] = useState((info.boardHeight - paddleHeight) / 2);
	const [opponentY, setOpponentY] = useState((info.boardHeight - paddleHeight) / 2);
	// score
	const [playerScore, setPlayerScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	// canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);


	var i =  1;
	useEffect(() => {
		if (i++ === 1 && playerMode === DOUBLE_MODE)
		{
			// socket.emit('update', {x: ballX, y: ballY});
			socket.emit('join', { name: 'Fany', level: level, gameId: 19 }, () => {});
			socket.on('welcome', ({ message, opponent }) => {
				console.log({ message, opponent });
			});
			socket.on('opponentJoin', ({ message, opponent }) => {
				console.log({ message, opponent });
			});
			socket.on('opponentMove', ({ from, to }) => {
				// set a move opponent function to receive opponent move event
			});
			socket.on('message', ({ message }) => {
				console.log({ message });
			});
		}
	}, [playerMode])
	
	const detectOpponentCollision = () => {
		if (ballX + ballRadius >= info.opponentX && ballY > opponentY && ballY < opponentY + paddleHeight) {
			setDeltaX(x => x *= -1);
			setBallX(x => x -= ballRadius);

			let collisionPoint = (ballY + (ballRadius / 2)) - (opponentY + (paddleHeight / 2));
			collisionPoint = collisionPoint / (paddleHeight / 2);

			let angle = (Math.PI / 4) * collisionPoint + Math.random();

			setDeltaX(-speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}

	const detectPlayerCollision = () => {
		if (ballX - ballRadius <= info.playerX && ballY > playerY && ballY < playerY + paddleHeight) {
			setBallX(x => x += ballRadius);

			let collisionPoint = (ballY + (ballRadius / 2)) - (playerY + (paddleHeight / 2));
			collisionPoint = collisionPoint / (paddleHeight / 2);

			let angle = (Math.PI / 4) * collisionPoint + Math.random();

			setDeltaX(speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}
	
	const serve = (side: number) => {

		setSpeed(info.initialSpeed);

		setBallX(info.boardWidth / 2);
		setBallY(info.boardHeight / 2);

		setDeltaX(4 * side); // speed * Math.cos(angle) * side);
		setDeltaY(4); // speed * Math.sin(angle));
	}

	const startGame = (side: number) => {
		if (!isRunning) {
			setPlayerScore(0);
			setOpponentScore(0);
			setGameOver(false);
			setSpeed(3);
			if (level !== BEGINNER_LEVEL) {
				setBallRadius(level === MEDIUM_LEVEL ? 10 : 6);
				setPaddleHeight(level === MEDIUM_LEVEL ? 80 : 40);
				setPlayerY((info.boardHeight - paddleHeight) / 2);
				setOpponentY((info.boardHeight - paddleHeight) / 2);
			}
		}

		setIsRunning(true);
		serve(side);
	}
	
	const detectWallCollision = () => {
		const minY    = ballRadius;
		const maxY    = info.boardHeight - ballRadius;

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
		if (ballX >= info.boardWidth)
		{
			setPlayerScore(p => p += 1);
			serve(OPPONENT_SIDE);	
		}
	}
	
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
	}
	
	const moveOpponent = () => {
		const nextPos = ballY - (paddleHeight / 2) * (level === HARD_LEVEL ? 0.3 : 0.1);
		
		if (playerMode === SINGLE_MODE 
			&& nextPos >= 0 
			&& nextPos + paddleHeight <= info.boardHeight) {
			setOpponentY(nextPos);
		}
	}
	
	const drawBoard = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, info.boardWidth, info.boardHeight);
		// draw background
		context.fillStyle = '#4E6E81';
		context.fillRect(0, 0, info.boardWidth, info.boardHeight);
		context.save();
		// draw score
		context.fillStyle = '#F2F2F2';
		context.font = '42px Inter';
		context.fillText(' ' + playerScore, 245, 50);
		context.fillText(' ' + opponentScore, 345, 50);
	}
	
	const drawElement = (context: CanvasRenderingContext2D) => {
		// draw player
		context.fillStyle = '#F2F2F2';
		context.fillRect(info.playerX, playerY,
			info.paddleWidth, paddleHeight);
		context.save();
		// draw opponent
		context.fillStyle = '#F2F2F2';
		context.fillRect(info.opponentX, opponentY,
			info.paddleWidth, paddleHeight);
		context.save();
		// draw ball
		context.strokeStyle = '#F2F2F2';
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
	}

	// render game
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
		return;
		const context = canvas.getContext('2d');
		if (!context)
		return;
		
		
		drawBoard(context);
		if (isRunning) {
			drawElement(context);
			moveBall();
			moveOpponent();
			detectWallCollision();
			detectPlayerCollision();
			detectOpponentCollision();
			// check game status
			if (opponentScore > info.winnerScore || playerScore > info.winnerScore) {
				playerScore > info.winnerScore ? setWinner(PLAYER_WIN) : setWinner(OPPONENT_WIN);
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

	const handleMouseEvent = (event: MouseEvent<HTMLDivElement>) => {
		const nextPos = event.clientY - info.boardHeight + paddleHeight;

		if (toolMode === MOUSE_MODE 
			&& isRunning 
			&& nextPos >= 0 
			&& nextPos + paddleHeight <= info.boardHeight) {
			setPlayerY(nextPos);
		}
	}

	const handleKeyDownEvent = (event: KeyboardEvent<HTMLDivElement>) => {
		if (toolMode === KEYBOARD_MODE && isRunning)
		{
			const nextPostUp = playerY - 20;
			const nextPostDown = playerY + 20 + paddleHeight;
			if (event.code === "ArrowUp" && nextPostUp >= 0) {
				setPlayerY(y => y -= 20);
			}
			if (event.code === "ArrowDown" && nextPostDown <= info.boardHeight) {
				setPlayerY(y => y += 20);
			}
		}
	}

	return (
		<>
			{(!isRunning || gameOver) && (
				<Modal 
					onDifficulty={(level) => {setLevel(level)}}
					onTool={(mode) => {setToolMode(mode)}}
					onPlayerMode={(mode) => {setPlayerMode(mode)}}
					onStartPage={() => startGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE)}
					buttonText={gameOver ? "Play again" : "Start playing"}
					text={winner === PLAYER_WIN ? "You wins!" : "You lose!"}
				/>
			)}
			<div className="outer_ground" onMouseMove={handleMouseEvent} onKeyDown={handleKeyDownEvent} tabIndex={0}>
				<div className="divider_line"></div>
				<div className="inner_ground">
					<canvas 
						ref={canvasRef}
						width={info.boardWidth}
						height={info.boardHeight}
					/>
				</div>
			</div>
		</>
	);
}
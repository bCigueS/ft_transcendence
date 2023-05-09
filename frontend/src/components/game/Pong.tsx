import React, { useState, useRef, useEffect, useLayoutEffect, MouseEvent, KeyboardEvent } from 'react';
import ModalBoard from './ModalBoard';
import LiveBoard from './LiveBoard';
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

type PongProps = {
	username: string;
}

export default function Pong({username}: PongProps) {
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
	const [isPaused, setIsPaused] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(0);
	const [gameId, setGameId] = useState(0);
	// game mode
	const [toolMode, setToolMode] = useState(MOUSE_MODE);
	const [level, setLevel] = useState(BEGINNER_LEVEL);
	const [playerMode, setPlayerMode] = useState(SINGLE_MODE);
	// animation
	const [frameCount, setFrameCount] = useState(0);
	const [speed, setSpeed] = useState(0);
	// ball info
	const [ballRadius, setBallRadius] = useState(10);
	const [ballX, setBallX] = useState(0);
	const [ballY, setBallY] = useState(0);
	// ball direction
	const [deltaX, setDeltaX] = useState(0); // speed * Math.cos(angle));
	const [deltaY, setDeltaY] = useState(0); // speed * Math.sin(angle));
	// paddle info
	const [paddleUp, setPaddleUp] = useState(false);
	const [paddleDown, setPaddleDown] = useState(false);
	const [paddleHeight, setPaddleHeight] = useState(120);
	// players info
	const [playerY, setPlayerY] = useState((info.boardHeight - paddleHeight) / 2);
	const [opponentY, setOpponentY] = useState((info.boardHeight - paddleHeight) / 2);
	const [opponentName, setOpponentName] = useState('');
	// score
	const [playerScore, setPlayerScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	// canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (playerMode === DOUBLE_MODE) {

			socket.emit('join', {name: username, level: level}, (message: string) => {
				console.log(message);
			});
			socket.on('welcome', ({ message, opponent, gameId }) => {
				console.log({ message, opponent, gameId });
				setGameId(gameId);
				setIsLive(true);
				if (opponent) {
					setOpponentName(opponent.name);
				}
			});
			socket.on('opponentJoin', ({ message, opponent }) => {
				console.log({ message, opponent });
				setOpponentName(opponent.name);
			});
			socket.on('startGame', ({ message }) => {
				console.log({ message });
				setIsReady(true);
			});
			socket.on('opponentLeft', ({message}) => {
				console.log({message});
				setGameOver(true);
				setWinner(PLAYER_WIN);
			});
			socket.on('stopGame', ({ message }) => {
				console.log({ message });
				setIsRunning(false);
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
		if (ballX - ballRadius <= info.playerX + info.paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
			setBallX(x => x += ballRadius);

			let collisionPoint = (ballY + (ballRadius / 2)) - (playerY + (paddleHeight / 2));
			collisionPoint = collisionPoint / (paddleHeight / 2);

			let angle = (Math.PI / 4) * collisionPoint + Math.random();

			setDeltaX(speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}

	useEffect(() => {
		if (isRunning)
		{		
			setSpeed(info.initialSpeed);

			setBallX(info.boardWidth / 2);
			setBallY(info.boardHeight / 2);

			let angle = (Math.PI / 4) * Math.random();

			setDeltaX(speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));
		}
	}, [isRunning]);
	
	const serve = (side: number) => {		
		setSpeed(info.initialSpeed);

		setBallX(info.boardWidth / 2);
		setBallY(info.boardHeight / 2);

		let angle = (Math.PI / 4) * Math.random();

		setDeltaX(speed * Math.cos(angle) * side);
		setDeltaY(speed * Math.sin(angle));
	}

	const startGame = (side: number) => {
		if (!isRunning) {
			setPlayerScore(0);
			setOpponentScore(0);
			setGameOver(false);
			if (level !== BEGINNER_LEVEL) {
				setBallRadius(level === MEDIUM_LEVEL ? 10 : 6);
				setPaddleHeight(level === MEDIUM_LEVEL ? 80 : 40);
				setPlayerY((info.boardHeight - paddleHeight) / 2);
				setOpponentY((info.boardHeight - paddleHeight) / 2);
			}
		}

		// serve(side);
		setIsRunning(true);
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
		// setDeltaX(x => x += speed);
		// setDeltaY(y => y += speed);

		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
	}

	const moveOpponent = () => {
		const nextPos = ballY - (paddleHeight / 2) * (level === HARD_LEVEL ? 0.3 : 0.1);
		
		if (playerMode === SINGLE_MODE 
			&& nextPos >= 0 
			&& nextPos + paddleHeight <= info.boardHeight) {
			setOpponentY(nextPos);
		} else if (playerMode === DOUBLE_MODE) {
			socket.on('paddleMove', ({y}) => {
				setOpponentY(y);
			});
		}
	}

	const movePlayer = () => {
		if (toolMode === KEYBOARD_MODE && isRunning)
		{
			const nextPostUp = playerY - 15;
			const nextPostDown = playerY + 15 + paddleHeight;
			if (paddleUp && nextPostUp >= 0) {
				setPlayerY(nextPostUp);
				if (playerMode === DOUBLE_MODE) {
					socket.emit('move', {y: nextPostUp, gameId: gameId});
				}
			}
			if (paddleDown && nextPostDown <= info.boardHeight) {
				setPlayerY(nextPostDown - paddleHeight);
				if (playerMode === DOUBLE_MODE) {
					socket.emit('move', {y: nextPostDown - paddleHeight, gameId: gameId});
				}
			}
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
			if (!isPaused) { 
				moveBall();
				movePlayer();
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

	// event handler
	useEffect(() => {
		window.onkeydown = function(event) {
			if (toolMode === KEYBOARD_MODE && isRunning)
			{
				if (event.code === "ArrowUp") {
					setPaddleUp(true);
				}
				if (event.code === "ArrowDown") {
					setPaddleDown(true);
				}
				if (event.code === "Space") {
					setIsPaused(current => !current);
				}
			}
		}

		window.onkeyup = function(event) {
			if (toolMode === KEYBOARD_MODE && isRunning)
			{
				if (event.code === "ArrowUp") {
					setPaddleUp(false);
				}
				if (event.code === "ArrowDown") {
					setPaddleDown(false);
				}
			}
		}

		window.onmousemove = function(event) {
			const nextPost = event.clientY - info.boardHeight + (paddleHeight / 2);
		
			if (toolMode === MOUSE_MODE && isRunning) {
				if ( nextPost >= 0 && nextPost + paddleHeight <= info.boardHeight) {
						setPlayerY(nextPost);
						if (playerMode === DOUBLE_MODE) {
							socket.emit('move', {y: nextPost, gameId: gameId});
						}
				} else if (nextPost < 0) {
					setPlayerY(0);
					if (playerMode === DOUBLE_MODE) {
						socket.emit('move', {y: 0, gameId: gameId});
					}
				} else if (nextPost + paddleHeight > info.boardHeight) {
					setPlayerY(info.boardHeight - paddleHeight);
					if (playerMode === DOUBLE_MODE) {
						socket.emit('move', {y: info.boardHeight - paddleHeight, gameId: gameId})
					}
				}
			}
		}
	}, [toolMode, isRunning, paddleUp, paddleDown, isPaused, playerY]);
	
	return (
		<>
			{(!isRunning && isLive) && (
				<LiveBoard
					isReady={isReady}
					username={username}
					opponentName={opponentName}
					start={(status) => {setIsRunning(status); setIsLive(false)}}
				/>
			)}
			{((!isRunning && !isLive) || gameOver) && (
				<ModalBoard 
					onDifficulty={(level) => {setLevel(level)}}
					onTool={(mode) => {setToolMode(mode)}}
					onPlayerMode={(mode) => {setPlayerMode(mode)}}
					onStartPage={() => startGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE)}
					buttonText={gameOver ? "Play again" : "Start playing"}
					text={winner === PLAYER_WIN ? "You wins!" : "You lose!"}
				/>
			)}
			<div className="outer_ground">
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
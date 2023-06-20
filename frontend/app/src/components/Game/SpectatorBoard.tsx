import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { PongInfo, SpectatorProp, UpdatedInfo } from './utils/types';
import LiveBoard from './LiveBoard';
import PausedBoard from './PausedBoard';
import classes from '../../sass/components/Game/Pong.module.scss';
import io from 'socket.io-client';


const socket = io('http://localhost:3000/pong', {
		transports: ["websocket"],
		}
	);

// Modal's element
const BEGINNER_LEVEL = 0;
const MEDIUM_LEVEL = 1;
const HARD_LEVEL = 2;
const SPECIAL_LEVEL = 3;

// Game's element
// const PLAYER_WIN = -1;
// const OPPONENT_WIN = 1;

// initial data for the game
const info: PongInfo = {
	boardWidth: 640,
	boardHeight: 480,
	paddleWidth: 10,
	obstacleWidth: 20,
	obstacleHeight: 150,
	obstacleSpeed: 12,
	initialSpeed: 5,
	initialDelta: 3,
	playerX: 10,
	opponentX: 620, // boardWidth - paddleWidth - 10,
	obstacleX: 310, // (boardWidth - obstacleWidth) / 2,
	winnerScore: 3,
}

export default function SpectatorBoard(spectatorProp: SpectatorProp) {
	// game play
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [closingText, setClosingText] = useState('');
	// animation
	const [frameCount, setFrameCount] = useState(0);
	const [speed, setSpeed] = useState(0);
	// ball info
	const [ballRadius, setBallRadius] = useState(0);
	const [ballX, setBallX] = useState(0);
	const [ballY, setBallY] = useState(0);
	// ball direction
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);
	// paddle info
	const [paddleHeight, setPaddleHeight] = useState(0);
	// players info
	// const [playerId, setPlayerId] = useState(0);
	const [playerName, setPlayerName] = useState('');
	const [playerY, setPlayerY] = useState((info.boardHeight - paddleHeight) / 2);
	// const [opponentId, setOpponentId] = useState(0);
	const [opponentName, setOpponentName] = useState('');
	const [opponentY, setOpponentY] = useState((info.boardHeight - paddleHeight) / 2);
	// obstacle info
	const [obstacleY, setObstacleY] = useState(info.boardHeight);
	const [obstacleDir, setObstacleDir] = useState(true);
	// score
	const [playerScore, setPlayerScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	// canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// loop to emit a join request to the server
	useEffect(() => {
		if (spectatorProp.mode) {
			console.log('emit a request to join as spectator to server')
			// send join request to the server as a spectator
			socket.emit('spectatorJoin', { userId: spectatorProp.userId, gameRoom: spectatorProp.gameRoom });
		}
	}, [spectatorProp.mode, spectatorProp.gameRoom, spectatorProp.userId]);

	// loop to receive several game play events from the server
	useEffect(() => {
		if (spectatorProp.mode) {
			// receive a welcome message from server informing that you are in a specific game room, and trigger a liveBoard
			socket.on('welcomeSpectator', ({ message, player, opponent }) => {
				console.log({ message });
				if (player) {
					setPlayerName(player.name);
				}
				if (opponent) {
					setOpponentName(opponent.name);
				}
				setIsLive(true);
				setIsReady(false);
			});
			// receiving the latest ball position
			socket.on('currentGameInfo', ({ gameInfo }: { gameInfo: UpdatedInfo }) => {
				setBallX(gameInfo.x);
				setBallY(gameInfo.y);
				setDeltaX(gameInfo.dx);
				setDeltaY(gameInfo.dy);
				setSpeed(gameInfo.s);
				setPlayerY(gameInfo.playerY);
				setOpponentY(gameInfo.opponentY);
				setPlayerScore(gameInfo.pScore);
				setOpponentScore(gameInfo.oScore);
			});
			// receive a confirmation from server that game is ready to be displayed
			socket.on('startWatch', ({ message }) => {
				console.log({ message });
				setIsReady(true);
			});
			// receive a pause signal
			socket.on('makePause', ({ message }) => {
				console.log({ message });
				setIsPaused(current => !current);
			})
			// receive a message from server that game has ended
			socket.on('endWatch', ({ message }) => {
				console.log({ message });
				setClosingText(message);
				setGameOver(true);
				setIsRunning(false);
				socket.emit('leaveGameRoom', spectatorProp.gameRoom)
			});
		}
	}, [spectatorProp.mode, spectatorProp.gameRoom]);
	
	// function to set initial value to start the game
	const startGame = () => {
		if (!isRunning) {
			switch (spectatorProp.gameLevel) {
				case BEGINNER_LEVEL:
					setBallRadius(10);
					setPaddleHeight(120);
					break ;
				case MEDIUM_LEVEL:
					setBallRadius(10);
					setPaddleHeight(80);
					break ;
				case HARD_LEVEL:
				case SPECIAL_LEVEL:
					setBallRadius(6);
					setPaddleHeight(40);
					break ;
			}
			setGameOver(false);
		}		
		// toggle isRunning boolean to start the animation of the game
		setIsRunning(true);
	}
		
	// function to set an initial ball position and direction to start the round
	const ballServe = () => {
		// receiving the ball direction from server
		socket.on('ballServe', ({ dx, dy }) => {
			setDeltaX(dx);
			setDeltaY(dy);
			setBallX(info.boardWidth / 2);
			setBallY(info.boardHeight / 2);
			setSpeed(info.initialSpeed + spectatorProp.gameLevel);
		});
	}

	// functiom to set the uodated new score after ball passed one of the player paddle
	const updateScore = () => {
		// receiving the updated score from server
		socket.on('newScore', ({pScore, oScore}) => {
			setPlayerScore(pScore);
			setOpponentScore(oScore);
		});
	}
	
	// function to detect ball collision with all 4 part of the walls/borders
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
	}
		
	// function to detect when a ball hit the paddles
	const detectCollision = async () => {
		// receiving the new ball direction from server
		socket.on('ballLaunch', ({dx, dy, x, y, s}) => {
			setDeltaX(dx);
			setDeltaY(dy);
			setBallX(x);
			setBallY(y);
			setSpeed(s);
		});
	}
	
	// function to calculate the movement of the ball based on its direction
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
	}

	// function to calculate the opponent movement (against computer or other player)
	const moveOpponent = () => {
		// receiving a new opponent position from the server
		socket.on('opponentMove', ({y}) => {
			setOpponentY(y);
		});
	}

	// function to calculate the players movement based on its input (mouse event or keyboard event)
	const movePlayer = () => {
		// receiving a new player position from the server
		socket.on('playerMove', ({y}) => {
			setPlayerY(y);
		});
	}

	// function to calculate the steady movement of the obstacle
	const moveObstacle = () => {
		const nextPostUp = obstacleY - info.obstacleSpeed;
		const nextPostDown = obstacleY + info.obstacleSpeed + info.obstacleHeight;
		if (obstacleDir && nextPostUp >= 0) {
			setObstacleY(nextPostUp);
		} else if (!obstacleDir && nextPostDown <= info.boardHeight) {
			setObstacleY(nextPostDown - info.obstacleHeight);
		} else {
			setObstacleDir(current => !current);
		}
	} 
	
	// function to draw the board with its initial element
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
	
	// function to draw the elements of the game
	const drawElement = (context: CanvasRenderingContext2D) => {
		// draw player
		context.fillStyle = '#F2F2F2';
		context.fillRect(info.playerX, playerY, info.paddleWidth, paddleHeight);
		context.save();
		// draw opponent
		context.fillStyle = '#F2F2F2';
		context.fillRect(info.opponentX, opponentY, info.paddleWidth, paddleHeight);
		context.save();
		// draw ball
		context.strokeStyle = '#F2F2F2';
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
		if (spectatorProp.gameLevel === SPECIAL_LEVEL) {
			// draw obstacle 
			context.fillStyle = '#F2F2F2';
			context.fillRect(info.obstacleX, obstacleY, info.obstacleWidth, info.obstacleHeight);
			context.save();
		}
	}

	// render the game
	useLayoutEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
		return;
		const context = canvas.getContext('2d');
		if (!context)
		return;
		
		drawBoard(context);
		// start animation
		if (isRunning && !isPaused) {
			drawElement(context);
			moveBall();
			movePlayer();
			moveOpponent();
			if (spectatorProp.gameLevel === SPECIAL_LEVEL) {
				moveObstacle();
			}
			ballServe();
			detectCollision();
			detectWallCollision();
			updateScore();
		}
	}, [frameCount]);
	
	// update the frameCount
	useLayoutEffect(() => {
		const fps = 24;
		let frameId: number;

		const render = () => {
			setTimeout(() => {
				setFrameCount(fc => fc + 1);
				frameId = requestAnimationFrame(render);
			}, 1000 / fps);
		}

		frameId = requestAnimationFrame(render);
		
		return () => {window.cancelAnimationFrame(frameId);}
	}, []);
	
	return (
		<>
			{((!isRunning || gameOver) && isLive) && (
				<LiveBoard
					isReady={isReady}
					playerName={playerName}
					opponentName={opponentName}
					spectatorMode={true}
					start={() => {startGame()}}
					closingText={closingText}
				/>
			)}
			{(isPaused) && (
				<PausedBoard
					mode={'spectator'}
				/>
			)}
			<div className={classes.container}>
				<div className={classes.divider_line}></div>
				<div className={classes.playground}>
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
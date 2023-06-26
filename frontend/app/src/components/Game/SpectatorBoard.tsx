import { useState, useRef, useEffect, useCallback } from 'react';
import { BallInfo, PongInfo, SpectatorProp, UpdatedInfo } from './utils/types';
import LiveBoard from './LiveBoard';
import PausedBoard from './PausedBoard';
import classes from '../../sass/components/Game/Pong.module.scss';
import { UserAPI } from '../../store/users-contexte';

// Modal's element
const BEGINNER_LEVEL = 0;
const MEDIUM_LEVEL = 1;
const HARD_LEVEL = 2;
const SPECIAL_LEVEL = 3;

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

export default function SpectatorBoard(props: SpectatorProp) {
	// game play
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [screenTooSmall, setScreenTooSmall] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [closingText, setClosingText] = useState('');
	const [level, setLevel] = useState(BEGINNER_LEVEL);
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
	const [playerName, setPlayerName] = useState('');
	const [playerY, setPlayerY] = useState((info.boardHeight - paddleHeight) / 2);
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
	// animation
	const frameId = useRef(0);
	const prevFrameId = useRef(0);

	// loop to emit a join request to the server
	useEffect(() => {
		console.log('emit a request to join as spectator to server')
		// send join request to the server as a spectator
		props.socket?.emit('spectatorJoin', { userId: props.userId, gameRoom: props.gameRoom });
	}, [props.socket, props.gameRoom, props.userId]);

	// receive a welcome message from server informing that you are in a specific game room, and trigger a liveBoard
	useEffect(() => {
		const handleWelcomeSpectator = ({ message, player, opponent, level }: { message: string, player: UserAPI, opponent: UserAPI, level: number }) => {
			console.log({ message });
			if (player) {
				setPlayerName(player.name);
			}
			if (opponent) {
				setOpponentName(opponent.name);
			}
			setLevel(level);
			setIsLive(true);
			setIsReady(false);
		};

		props.socket?.on('welcomeSpectator', handleWelcomeSpectator);
		
		return () => {
			props.socket?.off('welcomeSpectator', handleWelcomeSpectator);
		}
	}, [props.socket]);

	// receiving the latest ball position
	useEffect(() => {
		const handleCurrentGameInfo = ({ gameInfo }: { gameInfo: UpdatedInfo }) => {
			setBallX(gameInfo.x);
			setBallY(gameInfo.y);
			setDeltaX(gameInfo.dx);
			setDeltaY(gameInfo.dy);
			setPlayerY(gameInfo.playerY);
			setOpponentY(gameInfo.opponentY);
			setPlayerScore(gameInfo.pScore);
			setOpponentScore(gameInfo.oScore);
			setIsPaused(gameInfo.isPaused);
			setScreenTooSmall(gameInfo.screenTooSmall);
		};

		props.socket?.on('currentGameInfo', handleCurrentGameInfo);
		
		return () => {
			props.socket?.off('currentGameInfo', handleCurrentGameInfo);
		}
	}, [props.socket]);

	// receive a confirmation from server that game is ready to be displayed
	useEffect(() => {
		const handleStartWatch = ({ message }: { message: string }) => {
			console.log({ message });
			setIsReady(true);
		};

		props.socket?.on('startWatch', handleStartWatch);

		return () => {
			props.socket?.off('startWatch', handleStartWatch);
		}
	}, [props.socket]);

	// receiving the new ball direction from server
	useEffect(() => {
		const handleBallServe = ({ dx, dy }: { dx: number, dy: number }) => {
			setDeltaX(dx);
			setDeltaY(dy);
			setBallX(info.boardWidth / 2);
			setBallY(info.boardHeight / 2);
		};

		props.socket?.on('ballServe', handleBallServe);
		
		return () => {
			props.socket?.off('ballServe', handleBallServe);
		}
	}, [props.socket]);

	// receiving the new ball direction after ball hit a paddle or obstacle
	useEffect(() => {
		const handleBallBounce = ({dx, dy, x, y, s}: BallInfo) => {
			setDeltaX(dx);
			setDeltaY(dy);
			setBallX(x);
			setBallY(y);
		};

		props.socket?.on('ballBounce', handleBallBounce);
		
		return () => {
			props.socket?.off('ballBounce', handleBallBounce);
		}
	}, [props.socket]);

	// receive a new updated score
	useEffect(() => {
		const handleNewScore = ({ pScore, oScore }: { pScore: number, oScore: number }) => {
			setPlayerScore(pScore);
			setOpponentScore(oScore);
		}

		props.socket?.on('newScore', handleNewScore);
		
		return () => {
			props.socket?.off('newScore', handleNewScore);
		}
	}, [props.socket]);

	// receiving the new position of player paddle from server
	useEffect(() => {
		const handlePlayerMove = ({ y }: { y: number }) => {
			setPlayerY(y);
		};

		props.socket?.on('playerMove', handlePlayerMove);
		
		return () => {
			props.socket?.off('playerMove', handlePlayerMove);
		}
	}, [props.socket]);

	// receiving the new position of opponent paddle from server
	useEffect(() => {
		const handleOpponentMove = ({ y }: { y: number }) => {
			setOpponentY(y);
		};

		props.socket?.on('opponentMove', handleOpponentMove);
		
		return () => {
			props.socket?.off('opponentMove', handleOpponentMove);
		}
	}, [props.socket]);

	useEffect(() => {
			const handleScreenTooSmall = ({ message, isTooSmall }: { message: string, isTooSmall: boolean }) => {
				console.log({ message });
				setScreenTooSmall(isTooSmall);
			};

			props.socket?.on('screenTooSmall', handleScreenTooSmall);
			
			return () => {
				props.socket?.off('screenTooSmall', handleScreenTooSmall);
			}
	}, [props.socket]);

	// receiving a pause signal
	useEffect(() => {
		const handleMakePause = ({ message }: { message: string }) => {
			console.log({ message });
			setIsPaused(current => !current);
		};

		props.socket?.on('makePause', handleMakePause);
		
		return () => {
			props.socket?.off('makePause', handleMakePause);
			}
	}, [props.socket]);

	// receive a signal that one player has left the game
	useEffect(() => {
		const handlePlayerDisconnected = ({ message }: { message: string }) => {
			console.log({ message });
		};

		props.socket?.on('playerDisconnected', handlePlayerDisconnected);
		
		return () => {
			props.socket?.off('playerDisconnected', handlePlayerDisconnected);
		}
	}, [props.socket]);

	// loop to receive a message from server that game has ended
	useEffect(() => {
		const handleEndWatch = ({ message }: {message: string}) => {
			console.log('in endWatch, ', { message });
			setIsRunning(false);
			setClosingText(message);
			setGameOver(true);
			props.socket?.emit('leaveGameRoom', props.gameRoom);
		};

		props.socket?.on('endWatch', handleEndWatch);

		return () => {
			props.socket?.off('endWatch', handleEndWatch);
		}
	}, [props.socket, props.gameRoom])
	
	// function to set initial value to start the game
	const startGame = () => {
		if (!isRunning) {
			switch (level) {
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

	// function to detect ball collision with all 4 part of the walls/borders
	const detectWallCollision = useCallback(() => {
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
	}, [ballRadius, ballY]);

	// function to calculate the movement of the ball based on its direction
	const moveBall = useCallback(() => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
	}, [deltaX, deltaY]);

	// function to calculate the steady movement of the obstacle
	const moveObstacle = useCallback(() => {
		const nextPostUp = obstacleY - info.obstacleSpeed;
		const nextPostDown = obstacleY + info.obstacleSpeed + info.obstacleHeight;
		if (obstacleDir && nextPostUp >= 0) {
			setObstacleY(nextPostUp);
		} else if (!obstacleDir && nextPostDown <= info.boardHeight) {
			setObstacleY(nextPostDown - info.obstacleHeight);
		} else {
			setObstacleDir(current => !current);
		}
	}, [obstacleDir, obstacleY]);
	
	// function to draw the board with its initial element
	const drawBoard = useCallback((context: CanvasRenderingContext2D) => {
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
	}, [opponentScore, playerScore]);
	
	// function to draw the elements of the game
	const drawElement = useCallback((context: CanvasRenderingContext2D) => {
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
		if (level === SPECIAL_LEVEL) {
			// draw obstacle 
			context.fillStyle = '#F2F2F2';
			context.fillRect(info.obstacleX, obstacleY, info.obstacleWidth, info.obstacleHeight);
			context.save();
		}
	}, [ballRadius, ballX, ballY, obstacleY, opponentY, paddleHeight, playerY, level]);
	
	// render the game
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		
		const context = canvas.getContext('2d');
		if (!context) return;
		
		const fps = 24;
		const frameDuration = 1000 / fps; // Frame duration in milliseconds
		
		const render = (timestamp: number) => {
			const deltaTime = timestamp - prevFrameId.current;
		
			if (deltaTime >= frameDuration) {
				prevFrameId.current = timestamp;
				
				console.log(isRunning);
				drawBoard(context);
				if (isRunning && !isPaused && !screenTooSmall) {
					drawElement(context);
					moveBall();
					detectWallCollision();
					// added function for special level
					if (level === SPECIAL_LEVEL) {
						moveObstacle();
					}
				}
			}
			
			frameId.current = requestAnimationFrame(render);
		};

		frameId.current = requestAnimationFrame(render);
		
		// Cleanup
		return () => {
			window.cancelAnimationFrame(frameId.current);
		};

		}, [drawBoard, drawElement,
			moveBall,
			detectWallCollision,
			moveObstacle,
			level,
			isRunning, isPaused, screenTooSmall]);
	
	return (
		<>
			{((!isRunning || gameOver) && isLive) && (
				<LiveBoard
					isReady={isReady}
					playerName={playerName}
					opponentName={opponentName}
					inviteMode={false}
					spectatorMode={true}
					start={() => {startGame()}}
					closingText={closingText}
				/>
			)}
			{(isPaused || screenTooSmall) && (
				<PausedBoard
					text={isPaused ? "Please wait for the players to continue the game" : "One of player's screen is too small"}
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
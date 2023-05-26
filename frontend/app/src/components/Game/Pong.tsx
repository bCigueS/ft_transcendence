import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ModalBoard from './ModalBoard';
import LiveBoard from './LiveBoard';
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
	initialDelta: number;
	playerX: number;
	opponentX: number;
	winnerScore: number;
}

type PongProps = {
	username: string;
}

// initial data for the game
const info: PongInfo = {
	boardWidth: 640,
	boardHeight: 480,
	paddleWidth: 10,
	initialSpeed: 5,
	initialDelta: 3,
	playerX: 10,
	opponentX: 620, // boardWidth - paddleWidth - 10,
	winnerScore: 11,
}


export default function Pong({username}: PongProps) {
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
	const [ballRadius, setBallRadius] = useState(0);
	const [ballX, setBallX] = useState(0);
	const [ballY, setBallY] = useState(0);
	// ball direction
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);
	// paddle info
	const [paddleUp, setPaddleUp] = useState(false);
	const [paddleDown, setPaddleDown] = useState(false);
	const [paddleHeight, setPaddleHeight] = useState(0);
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
			// if the game is for 2 players mode, start by sending a join request to the server
			socket.emit('join', { name: username, level: level }, (message: string) => {
				console.log(message);
			});
			// receive a welcome message from server informing that you are in a specific game room, and trigger a liveBoard
			socket.on('welcome', ({ message, opponent, gameId }) => {
				console.log({ message, opponent, gameId });
				setGameId(gameId);
				setIsLive(true);
				setIsReady(false);
				if (opponent) {
					setOpponentName(opponent.name);
				}
			});
			// receive an information about the opponent from server
			socket.on('opponentJoin', ({ message, opponent }) => {
				console.log({ message, opponent });
				setOpponentName(opponent.name);
			});
			// receive a confirmation from server to start the game, and trigger the liveBoard to start counting the countdown
			socket.on('startGame', ({ message }) => {
				console.log({ message });
				setIsReady(true);
			});
			// receive a message from a server that an opponent just left the game
			socket.on('opponentLeft', ({message}) => {
				console.log({message});
			});
			// receive a message from server to stop the game, and trigger the modalBoard
			socket.on('stopGame', ({ message }) => {
				console.log({ message });
				setGameOver(true);
				setWinner(PLAYER_WIN);
				stopGame();
			});
		}
	}, [playerMode])
	
	// function to detect when a ball hit the paddle of the opponent side
	const detectOpponentCollision = () => {
		if (ballX + ballRadius >= info.opponentX && ballY > opponentY && ballY < opponentY + paddleHeight) {
			// if the game is against computer, the calculation for the new direction is directly in the front
			if (playerMode === SINGLE_MODE) {
				setDeltaX(x => x *= -1);
				
				let collisionPoint = (ballY + (ballRadius / 2)) - (opponentY + (paddleHeight / 2));
				collisionPoint = collisionPoint / (paddleHeight / 2);
				
				let angle = (Math.PI / 4) * collisionPoint;
				
				setDeltaX(-speed * Math.cos(angle));
				setDeltaY(speed * Math.sin(angle));
			// if the game is against other player, calculation will be done by server
			} else if (playerMode === DOUBLE_MODE) {
				// receiving the new ball direction from server
				socket.on('ballLaunch', ({dx, dy}) => {
					// console.log("opponent dx, dy: ", dx, dy);
					setDeltaX(dx);
					setDeltaY(dy);
				});
			}
			
			setBallX(x => x -= ballRadius);
			setSpeed(s => s += 0.5);

			// console.log("opponenet collision: ", deltaX, deltaY, ballX, speed, "playerMode: ", playerMode);
		}
	}

	// function to detect when a ball hit the paddle of the player side
	const detectPlayerCollision = () => {
		if (ballX - ballRadius <= info.playerX + info.paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
			// send a signal to server to start calculating a new direction of the ball
			socket.emit('ballCollision', {
				gameInfo: {
					y: ballY,
					dx: deltaX,
					r: ballRadius,
					playerY: playerY,
					paddleHeight: paddleHeight,
					speed: speed,
				}, gameId: gameId,
			});
			// if the game is against computer, the calculation for the new direction is directly in the front
			if (playerMode === SINGLE_MODE) {
				let collisionPoint = (ballY + (ballRadius / 2)) - (playerY + (paddleHeight / 2));
				collisionPoint = collisionPoint / (paddleHeight / 2);
				
				let angle = (Math.PI / 4) * collisionPoint;
				
				setDeltaX(speed * Math.cos(angle));
				setDeltaY(speed * Math.sin(angle));
			// if the game is against other player, calculation will be done by server
			} else if (playerMode === DOUBLE_MODE) {
				// receiving the new ball direction from server
				socket.on('ballLaunch', ({dx, dy}) => {
					// console.log("player dx, dy: ", dx, dy);
					setDeltaX(dx);
					setDeltaY(dy);
				});
			}
			
			setBallX(x => x += ballRadius);
			setSpeed(s => s += 0.5);

			// console.log("player collision: ", deltaX, deltaY, ballX, speed, "playerMode: ", playerMode);
		}
	}
	
	// function to set an initial ball position and direction to start the round
	const serve = (side: number) => {

		setBallX(info.boardWidth / 2);
		setBallY(info.boardHeight / 2);
		
		setSpeed(info.initialSpeed + level);
		
		// if the game is against computer, the calculation for the ball direction is directly in the front
		if (playerMode === SINGLE_MODE) {
			setDeltaX((info.initialDelta + level) * side);
			setDeltaY(5 * (Math.random() * 2 - 1));
		// if the game is against other player, calculation will be done by server
		} else if (playerMode === DOUBLE_MODE) {
			// receiving the ball direction from server
			socket.on('ballServe', ({dx, dy}) => {
				// console.log("serve ball dx, dy: ", dx, dy);
				setDeltaX(dx);
				setDeltaY(dy);
			});
		}
		// console.log(ballX, ballY, deltaX, deltaY, speed);
	}
	
	// function to set initial value to start the game
	const startGame = (side: number) => {
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
					setBallRadius(6);
					setPaddleHeight(40);
					break ;
			}
			setPlayerY((info.boardHeight - paddleHeight) / 2);
			setOpponentY((info.boardHeight - paddleHeight) / 2);
			setPlayerScore(0);
			setOpponentScore(0);
			setGameOver(false);
		}
		
		// send a signal to server to start a calculation of the ball direction to start the round
		socket.emit('startBall', {
			gameInfo: {
				initialDelta: info.initialDelta,
				level: level,
			}, gameId: gameId,
		});
		
		// call serve function to set the ball values
		serve(side);
		// toggle isRunning boolean to start the animation of the game
		setIsRunning(true);
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
		// left collision / ball passing the player's paddle, so opponent gains a point
		if (ballX <= 0)
		{
			// send signal to server to calculate the ball direction for a new round
			socket.emit('startBall', {
				gameInfo: {
					initialDelta: info.initialDelta,
					level: level,
				}, gameId: gameId,
			});

			setOpponentScore(o => o += 1);
			serve(OPPONENT_SIDE);
		}
		//right collision / ball passing the opponent's paddle, so player gains a point
		if (ballX >= info.boardWidth)
		{
			setPlayerScore(p => p += 1);
			serve(PLAYER_SIDE);	
		}
	}
	
	// function to calculate the movement of the ball based on its direction
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
	}

	// function to calculate the opponent movement (against computer or other player)
	const moveOpponent = () => {
		// calculating movement of the computer
		const nextPos = ballY - (paddleHeight / 2) * (level === HARD_LEVEL ? 0.3 : 0.1);
		
		if (playerMode === SINGLE_MODE 
			&& nextPos >= 0 
			&& nextPos + paddleHeight <= info.boardHeight) {
			setOpponentY(nextPos);
		} else if (playerMode === DOUBLE_MODE) {
			// receiving a new position from the server, based on the other player's input
			socket.on('paddleMove', ({y}) => {
				setOpponentY(y);
			});
		}
	}

	// function to calculate the players movement based on its input (mouse event or keyboard event)
	const movePlayer = () => {
		if (toolMode === KEYBOARD_MODE && isRunning)
		{
			const nextPostUp = playerY - 15;
			const nextPostDown = playerY + 15 + paddleHeight;
			if (paddleUp && nextPostUp >= 0) {
				setPlayerY(nextPostUp);
				if (playerMode === DOUBLE_MODE) {
					// send the new position to server to be forwarded to other player
					socket.emit('moveInput', {y: nextPostUp, gameId: gameId});
				}
			}
			if (paddleDown && nextPostDown <= info.boardHeight) {
				setPlayerY(nextPostDown - paddleHeight);
				if (playerMode === DOUBLE_MODE) {
					// send the new position to server to be forwarded to other player
					socket.emit('moveInput', {y: nextPostDown - paddleHeight, gameId: gameId});
				}
			}
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

	// function to stop the animation by toggling the isRunning bool, and send a leave request to the server after 1 second
	const stopGame = () => {
		setIsRunning(false);
		if (playerMode === DOUBLE_MODE) {
			setTimeout(() => {
				socket.emit('leave', gameId, (message: string) => {
					console.log(message);
				});
			}, 1000);
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
		if (isRunning) {
			drawElement(context);
			moveBall();
			movePlayer();
			moveOpponent();
			detectWallCollision();
			detectPlayerCollision();
			detectOpponentCollision();
			// check game status
			if (opponentScore > info.winnerScore || playerScore > info.winnerScore) {
				playerScore > info.winnerScore ? setWinner(PLAYER_WIN) : setWinner(OPPONENT_WIN);
				setGameOver(true);
				stopGame();
			}
		}
	}, [frameCount])
	
	// update the frameCount
	useLayoutEffect(() => {
		if (!isPaused) {
			// set frame per second
			const fps = 24;
			let frameId: number;
	
			const render = () => {
				setTimeout(() => {
					setFrameCount(fc => fc + 1);
					frameId = requestAnimationFrame(render);
				}, 1000 / fps);
			}
	
			render();
			
			return () => {window.cancelAnimationFrame(frameId);}
		}
	}, [isPaused])

	// keyboard event handler
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

	}, [toolMode]);
	
	// mouse event handler
	useEffect(() => {
		window.onmousemove = function(event) {
			const nextPost = event.clientY - info.boardHeight + (paddleHeight / 2);
		
			if (toolMode === MOUSE_MODE && isRunning) {
				if ( nextPost >= 0 && nextPost + paddleHeight <= info.boardHeight) {
						setPlayerY(nextPost);
						if (playerMode === DOUBLE_MODE) {
							socket.emit('moveInput', {y: nextPost, gameId: gameId});
						}
				} else if (nextPost < 0) {
					setPlayerY(0);
					if (playerMode === DOUBLE_MODE) {
						socket.emit('moveInput', {y: 0, gameId: gameId});
					}
				} else if (nextPost + paddleHeight > info.boardHeight) {
					setPlayerY(info.boardHeight - paddleHeight);
					if (playerMode === DOUBLE_MODE) {
						socket.emit('moveInput', {y: info.boardHeight - paddleHeight, gameId: gameId})
					}
				}
			}
		}
	}, [toolMode])

	return (
		<>
			{(!isRunning && isLive) && (
				<LiveBoard
					isReady={isReady}
					username={username}
					opponentName={opponentName}
					start={() => {startGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE); setIsLive(false)}}
				/>
			)}
			{((!isRunning || gameOver) && !isLive) && (
				<ModalBoard 
					onDifficulty={(level) => {setLevel(level)}}
					onTool={(mode) => {setToolMode(mode)}}
					onPlayerMode={(mode) => {setPlayerMode(mode)}}
					onStartPage={() => startGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE)}
					buttonText={gameOver ? "Play again" : "Start playing"}
					text={winner === PLAYER_WIN ? "You wins!" : "You lose!"}
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
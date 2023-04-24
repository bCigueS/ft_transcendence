import { useState, useRef, useEffect, useLayoutEffect, MouseEventHandler, KeyboardEventHandler } from 'react';
import '../../sass/main.scss';
import Modal from './Modal';

const KEYBOARD_MODE = 1;
const MOUSE_MODE = 2;

const PLAYER_WIN = 3;
const OPPONENT_WIN = 4;

const PLAYER_SIDE = -1;
const OPPONENT_SIDE = 1;

const PLAYER_UP = 38;
const PLAYER_DOWN = 40;
const PAUSE = 32;

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
	const outerGround = {
		margin: "50px",
		borderRadius: "40px",
		display: "inline-block",
		width: "860px",
		height: "660px",
		backgroundColor: "#EBB6A9",
		alignItems: "center",
		zIndex: "1",
	}

	const innerGround = {
		margin: "80px 100px",
		display: "inline-block",
		width: "660px",
		height: "500px",
		backgroundColor: "#6EB0D9",
		alignItems: "center",
		border: "10px solid #F5F2E9",
		zIndex: "1",
	}

	const dividerLine = {
		margin: "0px 425px",
		width: "10px",
		height: "660px",
		backgroundColor: "#F5F2E9",
		position: "absolute" as "absolute",
		zIndex: "2",
	}

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
	const [speed, setSpeed] = useState(5);
	// ball position
	const [ballX, setBallX] = useState(pongInfo.boardWidth / 2);
	const [ballY, setBallY] = useState(pongInfo.boardHeight / 2);
	// direction
	const [deltaX, setDeltaX] = useState(4); // speed * Math.cos(angle));
	const [deltaY, setDeltaY] = useState(3); // speed * Math.sin(angle));
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
	const [mode, setMode] = useState(MOUSE_MODE);
	// canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
		
		setDeltaX(4); // speed * Math.cos(angle) * side);
		setDeltaY(3); // speed * Math.sin(angle));
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
		// top collision
		if (ballY < pongInfo.ballRadius) {
			setDeltaY(y => y *= -1);
			setBallY(y => y += pongInfo.ballRadius);
		}
		// bottom collision
		if (ballY > pongInfo.boardHeight - pongInfo.ballRadius) {
			setDeltaY(y => y *= -1);
			setBallY(y => y -= pongInfo.ballRadius);
		}
		// right & left collision
		if (ballX <= 0 || ballX >= pongInfo.boardWidth)
		{
			ballX <= 0 ? setOpponentScore(o => o += 1) : setPlayerScore(p => p += 1);
			ballX <= 0 ? serve(OPPONENT_SIDE) : serve(PLAYER_SIDE);
			// detect next scene
			if (playerScore >= pongInfo.winnerScore || opponentScore >= pongInfo.winnerScore) {
				setIsRunning(false);
				setGameOver(true);
				playerScore >= pongInfo.winnerScore ? setWinner(PLAYER_WIN) : setWinner(OPPONENT_WIN);
			}
		}
	}
	
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);

		const nextPos = ballY - (pongInfo.paddleHeight / 2);
		
		if (nextPos >= 0 && nextPos + pongInfo.paddleHeight <= pongInfo.boardHeight) {
			setOpponentY(nextPos); // to delete later
		}
	}
	
	const draw = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, pongInfo.boardWidth, pongInfo.boardHeight);
		// draw background
		context.fillStyle = '#6EB0D9';
		context.fillRect(0, 0, pongInfo.boardWidth, pongInfo.boardHeight);
		context.save();
		// draw player
		context.fillStyle = '#F5F2E9';
		context.fillRect(playerX, playerY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		context.save();
		// draw opponent
		context.fillStyle = '#F5F2E9';
		context.fillRect(opponentX, opponentY,
			pongInfo.paddleWidth, pongInfo.paddleHeight);
		context.save();
		// draw ball
		context.beginPath();
		context.arc(ballX, ballY, pongInfo.ballRadius, 0, 2 * Math.PI);
		context.fill();
		context.lineWidth = 0;
		context.strokeStyle = '#F5F2E9';
		context.stroke();
		// draw score
		context.font = '42px Inter';
		context.fillText(' ' + playerScore, 245, 50);
		context.fillText(' ' + opponentScore, 345, 50);
	}

	const handleMouseEvent: MouseEventHandler<HTMLDivElement> = (event) => {
		const nextPos = event.clientY - pongInfo.boardHeight - (pongInfo.paddleHeight / 2);

		if (mode === MOUSE_MODE 
			&& isRunning 
			&& nextPos >= 0 
			&& nextPos + pongInfo.paddleHeight <= pongInfo.boardHeight) {
			setPlayerY(nextPos);
		}
	}

	const handleKeyboardEvent: KeyboardEventHandler<HTMLDivElement> = (keyCode) => {
		console.log(keyCode);
		// if (keyCode == PAUSE) {}
		if (mode === KEYBOARD_MODE && isRunning)
		{
			// if (keyCode == PLAYER_UP) {}
			// if (keyCode == PLAYER_DOWN) {}
		}
	}
	
	return (
		<>
			{(!isRunning || gameOver) && (
				<Modal 
					buttonText={gameOver ? "Play again" : "Start playing"}
					text={winner === PLAYER_WIN ? "You wins!" : "You lose!"}
					onClickStart={() => restartGame(winner === PLAYER_WIN ? PLAYER_SIDE : OPPONENT_SIDE)}
					onMode={(mode) => {mode === "keyboard" ? setMode(KEYBOARD_MODE) : setMode(MOUSE_MODE)}}
				/>
			)}
			<div style={outerGround} className="outer_ground" onMouseMove={handleMouseEvent} onKeyPress={handleKeyboardEvent}>
				<div style={dividerLine} className="divider_line"></div>
				<div style={innerGround} className="inner_ground">
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
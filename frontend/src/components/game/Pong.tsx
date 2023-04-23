import { useState, useRef, useEffect, useLayoutEffect, MouseEventHandler } from 'react';

type PongInfo = {
	boardWidth: number;
	boardHeight: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeed: number;
	ballRadius: number;
	upArrow: number;
	downArrow: number;
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
		margin: "0px 425px",
		width: "10px",
		height: "660px",
		backgroundColor: "#F5F2E9",
		position: "absolute" as "absolute",
		zIndex: "2",
	}
	
	const pongInfo: PongInfo = {
		boardWidth: 640,
		boardHeight: 440,
		paddleWidth: 10,
		paddleHeight: 80,
		paddleSpeed: 5,
		ballRadius: 10,
		upArrow: 38,
		downArrow: 40,
	}
	
	// ball position
	const [ballX, setBallX] = useState(pongInfo.boardWidth / 2);
	const [ballY, setBallY] = useState(pongInfo.boardHeight / 2);
	// direction
	const [deltaX, setDeltaX] = useState(4);
	const [deltaY, setDeltaY] = useState(2);
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
	const [speed, setSpeed] = useState(3);
	// game over
	const [gameOver, setGameOver] = useState(false);
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
		moveBall();
		detectWallCollision();
		detectPlayerCollision();
		detectOpponentCollision();
			
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
			collisionPoint = collisionPoint / (pongInfo.paddleHeight / 2) + Math.random();

			let angle = (Math.PI / 4) * collisionPoint;

			setDeltaX(-speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}

	const detectPlayerCollision = () => {
		if (ballX - pongInfo.ballRadius <= playerX && ballY > playerY && ballY < playerY + pongInfo.paddleHeight) {
			// setDeltaX(x => x *= -1);
			setBallX(x => x += pongInfo.ballRadius);

			let collisionPoint = (ballY + (pongInfo.ballRadius / 2)) - (playerY + (pongInfo.paddleHeight / 2));
			collisionPoint = collisionPoint / (pongInfo.paddleHeight / 2) + Math.random();

			let angle = (Math.PI / 4) * collisionPoint;

			setDeltaX(speed * Math.cos(angle));
			setDeltaY(speed * Math.sin(angle));

			setSpeed(s => s += 0.5);
		}
	}
	
	const reset = () => {
		setBallX(pongInfo.boardWidth / 2);
		setBallY(pongInfo.boardHeight / 2);
		
		setDeltaX(2);
		setDeltaY(2);
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
		// right collision
		if (ballX >= pongInfo.boardWidth) {
			setPlayerScore(p => p += 1);
			reset();
		}
		// left collision
		if (ballX <= 0) {
			setOpponentScore(o => o += 1);
			reset();
		}
	}
	
	const moveBall = () => {
		setBallX(x => x += deltaX);
		setBallY(y => y += deltaY);
		
		setOpponentY(y => ballY - pongInfo.paddleHeight /2); // to delete later
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
		context.fillText(' ' + playerScore, 250, 50);
		context.fillText(' ' + opponentScore, 355, 50);
	}

	const handleMouseEvent: MouseEventHandler<HTMLDivElement> = (event) => {
		setPlayerY(y => event.clientY - pongInfo.boardHeight - (pongInfo.paddleHeight / 2));
	}
	
	return (
		<div style={outerGround} className="outer_ground" onMouseMove={handleMouseEvent}>
			<div style={dividerLine} className="divider_line"></div>
			<div style={innerGround} className="inner_ground">
				<canvas 
					ref={canvasRef}
					width={pongInfo.boardWidth}
					height={pongInfo.boardHeight}
				/>
			</div>
		</div>
	);

}
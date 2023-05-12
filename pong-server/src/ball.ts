import { GameInfo, BallInfo } from './types'; 

let x = 0;
let y = 0;
let deltaX = 0;
let deltaY = 0;
let speed = 0;

const serve = (info: GameInfo): BallInfo => {
	x = info.boardWidth / 2;
	y = info.boardHeight / 2;
	deltaX = (info.initialDelta + info.level) * info.side;
	deltaY = 5 * (Math.random() * 2 - 1);
	speed = info.initialSpeed + info.level;

	return {
		x,
		y,
		deltaX,
		deltaY,
		speed,
	}
}

const moveBall = (ball: BallInfo): {x: number, y: number} => {
	x += deltaX;
	y += deltaY;

	return {
		x,
		y,
	}
}

// const detectOpponentCollision = (info: GameInfo) => {
// 	if (ballX + ballRadius >= info.opponentX && ballY > opponentY && ballY < opponentY + paddleHeight) {
// 		setDeltaX(x => x *= -1);
// 		setBallX(x => x -= ballRadius);

// 		let collisionPoint = (ballY + (ballRadius / 2)) - (opponentY + (paddleHeight / 2));
// 		collisionPoint = collisionPoint / (paddleHeight / 2);

// 		let angle = (Math.PI / 4) * collisionPoint;

// 		setDeltaX(-speed * Math.cos(angle));
// 		setDeltaY(speed * Math.sin(angle));

// 		setSpeed(s => s += 0.5);
// 	}
// }

// const detectPlayerCollision = (info: GameInfo) => {
// 	if (ballX - ballRadius <= info.playerX + info.paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
// 		setBallX(x => x += ballRadius);

// 		let collisionPoint = (ballY + (ballRadius / 2)) - (playerY + (paddleHeight / 2));
// 		collisionPoint = collisionPoint / (paddleHeight / 2);

// 		let angle = (Math.PI / 4) * collisionPoint;

// 		setDeltaX(speed * Math.cos(angle));
// 		setDeltaY(speed * Math.sin(angle));

// 		setSpeed(s => s += 0.5);
// 	}
// }

// const detectWallCollision = (info: GameInfo) => {
// 	const minY    = ballRadius;
// 	const maxY    = info.boardHeight - ballRadius;

// 	// top collision
// 	if (ballY < minY) {
// 		setDeltaY(y => y * -1);
// 		setBallY(minY);
// 	}
// 	// bottom collision
// 	if (ballY > maxY) {
// 		setDeltaY(y => y * -1);
// 		setBallY(maxY);
// 	}
// 	// left collision
// 	if (ballX <= 0)
// 	{
// 		setOpponentScore(o => o += 1);
// 		serve(PLAYER_SIDE);
// 	}
// 	//right collision
// 	if (ballX >= info.boardWidth)
// 	{
// 		setPlayerScore(p => p += 1);
// 		serve(OPPONENT_SIDE);	
// 	}
// }

export { serve, moveBall };

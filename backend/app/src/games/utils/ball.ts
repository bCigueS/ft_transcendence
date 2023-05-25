import { ServeInfo, CollisionInfo, BallInfo } from './types'; 

// a function to calculate a new direction of the ball to start the game
const serveBall = (info: ServeInfo): BallInfo => {
	let dx = 0, dy = 0;

	dx = (info.initialDelta + info.level);
	dy = 5 * (Math.random() * 2 - 1);
	
	// console.log("result of serve ball: ", dx, dy);
	return {dx, dy}
}

// a function to calculate a new direction of the game after the ball hit a paddle
const ballCollision = (info: CollisionInfo): BallInfo => {
	let dx = 0, dy = 0;

	// the area of the paddle where the ball hits (top/middle/bottom) affect the calculation of the new direction
	let collisionPoint = (info.y + (info.r / 2)) - (info.playerY + (info.paddleHeight / 2));
	collisionPoint = collisionPoint / (info.paddleHeight / 2);

	let angle = (Math.PI / 4) * collisionPoint;

	dx = info.speed * Math.cos(angle);
	dy = info.speed * Math.sin(angle);

	// console.log("result of playerCollision", dx, dy);
	return {dx, dy}
}

export { serveBall, ballCollision };

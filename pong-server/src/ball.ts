import { ServeInfo, CollisionInfo, BallInfo } from './types'; 


const serveBall = (info: ServeInfo): BallInfo => {
	let dx = 0, dy = 0;

	dx = (info.initialDelta + info.level);
	dy = 5 * (Math.random() * 2 - 1);
	
	console.log("result of serve ball: ", dx, dy);
	return {dx, dy}
}

const playerCollision = (info: CollisionInfo): BallInfo => {
	let dx = 0, dy = 0;

	let collisionPoint = (info.y + (info.r / 2)) - (info.playerY + (info.paddleHeight / 2));
	collisionPoint = collisionPoint / (info.paddleHeight / 2);

	let angle = (Math.PI / 4) * collisionPoint;

	dx = info.speed * Math.cos(angle);
	dy = info.speed * Math.sin(angle);

	console.log("result of playerCollision", dx, dy);
	return {dx, dy}
}
	
const opponentCollision = (info: CollisionInfo): BallInfo => {
	let dx = 0, dy = 0;

	// dx = info.dx * -1;
	// x = info.x - info.r;

	// let collisionPoint = (info.y + (info.r / 2)) - (info.opponentY + (info.paddleHeight / 2));
	// collisionPoint = collisionPoint / (info.paddleHeight / 2);

	// let angle = (Math.PI / 4) * collisionPoint;

	// dx = -info.speed * Math.cos(angle);
	// dy = info.speed * Math.sin(angle);

	console.log("result of playerCollision", dx, dy);
	return {dx, dy}
}

export { serveBall, playerCollision, opponentCollision };

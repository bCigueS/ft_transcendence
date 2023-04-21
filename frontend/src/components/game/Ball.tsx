import React from 'react';
import Canvas from '../Canvas';


function Ball() {
	const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
		ctx.beginPath();
		ctx.arc(100, 100, 10, 0, 2 * Math.PI);
		ctx.fill();
		ctx.lineWidth = 0;
		ctx.strokeStyle = '#fff';
		ctx.stroke();
	}

	return <Canvas
				draw={draw}
				width={800}
				height={500}
			/>
}

export default Ball;
import React from 'react';
import { useRef, useEffect } from 'react';

const useCanvas = (draw: Function) => {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null)
			return ;
		const context = canvas.getContext('2d');
		let frameCount = 0;
		let animationFrameId: any;

		const render = () => {
			frameCount++;
			draw(context, frameCount);
			animationFrameId = window.requestAnimationFrame(render);
		}
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		}
	}, [draw])

	return canvasRef
}

const Canvas = (props:any) => {

	const { draw, ...rest } = props;
	const canvasRef = useCanvas(draw);

	return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas;
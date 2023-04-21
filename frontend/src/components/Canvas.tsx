import React from 'react';
import { useRef, useEffect } from 'react';

type CanvasProps = React.DetailedHTMLProps <
					React.CanvasHTMLAttributes<HTMLCanvasElement>,
					HTMLCanvasElement
					> & {draw: (context: CanvasRenderingContext2D, frameCount: number) => void};

const useCanvas = (draw: Function) => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return;
		const context = canvas.getContext('2d');
		if (!context)
			return                                                                                                ;
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

const Canvas: React.FC<CanvasProps> = (props:CanvasProps) => {

	const { draw, ...rest } = props;
	const canvasRef = useCanvas(draw);

	return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas;
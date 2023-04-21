import React from 'react';
import Canvas from '../Canvas';
import Ball from './Ball';
import Player from './Player';

type PongProps = {
	height: number;
	width: number;
	paddleHeight: number;
	paddleWidth: number;
	paddleSpeed: number;
	ballSize: number;
	upArrow: number;
	downArrow: number;
}

type PongState = {
	ball: {
		x: number;
		y: number;
	};
	ballSpeed: number;
	direction: {
		x: number;
		y: number;
	};
	player: {
		x: number;
		y: number;
		score: number;
	};
	opponent: {
		x: number;
		y: number;
		score: number;
	};
}

const InitialState = (props: PongProps) => {
	return {
		ball: {
			x: 100,
			y: 100,
		},
		ballSpeed: 30,
		direction: {
			x: 0,
			y: 0,
		},
		player: {
			x: 10,
			y: (props.height - props.paddleHeight) / 2,
			score: 0,
		},
		opponent: {
			x: props.width - props.paddleWidth - 10,
			y: (props.height - props.paddleHeight) / 2,
			score: 0,
		},
	}
}

const MIN_X = 12,
	MIN_Y = 12,
	MAX_X = 800 - MIN_X,
	MAX_Y = 500 - MIN_Y

class Pong extends React.Component<PongProps, PongState> {
	constructor(props: PongProps) {
		super(props);
		this.state = InitialState(props);
	}

	componentDidMount() {
		const x = Math.floor(Math.random() * this.state.ballSpeed);
		const y = this.state.ballSpeed - x;
		this.setState({ direction: { x, y }});
		this.animate();
	}

	newCoord = (val: number, delta: number, max: number, min: number) => {
		let newVal = val + delta;
		let newDelta = delta;

		if (newVal > max || newVal < min) {
			newDelta = -delta;
		}

		if (newVal< min) {
			newVal = min - newVal;
		}

		if (newVal > max) {
			newVal = newVal - (newVal - max);
		}

		return { val: newVal, delta: newDelta };
	};

	animate = () => {
		const { ball, direction } = this.state;

		if (direction.x !== 0 || direction.y !== 0) {
			const newX = this.newCoord(ball.x, direction.x, MAX_X, MIN_X);
			const newY = this.newCoord(ball.y, direction.y, MAX_Y, MIN_Y);

			this.setState({
				ball: { x: newX.val, y: newY.val, },
				direction: { x: newX.delta, y: newY.delta,}
			});
		}

		setTimeout(this.animate, 50);
	}

	render() {
		const outerGround = {
			margin: "50px",
			borderRadius: "40px",
			display: "inline-block",
			width: "1260px",
			height: "840px",
			backgroundColor: "#EBB6A9",
			alignItems: "center",
		}

		const innerGround = {
			margin: "160px 220px",
			display: "inline-block",
			width: "820px",
			height: "520px",
			backgroundColor: "#6EB0D9",
			alignItems: "center",
			border: "10px solid #F5F2E9",
			zIndex: "1",
		}

		const dividerLine = {
			margin: "0px 620px",
			width: "15px",
			height: "840px",
			backgroundColor: "#F5F2E9",
			position: "absolute" as "absolute",
			zIndex: "2",
		}

		const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
			// draw background
			ctx.clearRect(0, 0, this.props.width, this.props.height);
			ctx.fillStyle = '#6EB0D9';
			ctx.fillRect(0, 0, this.props.width, this.props.height);
			ctx.save();

			// draw player
			ctx.fillStyle = '#F5F2E9';
			ctx.fillRect(this.state.player.x, this.state.player.y,
				this.props.paddleWidth, this.props.paddleHeight);
			ctx.save();

			// draw opponent
			ctx.fillStyle = '#F5F2E9';
			ctx.fillRect(this.state.opponent.x, this.state.opponent.y,
				this.props.paddleWidth, this.props.paddleHeight);
			ctx.save();
			
			// draw ball
			ctx.beginPath();
			ctx.arc(100, 100, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.lineWidth = 0;
			ctx.strokeStyle = '#F5F2E9';
			ctx.stroke();
			
			// draw scoreboard
			ctx.font = '10px Arial';
			ctx.fillText('Player: ' + this.state.player.score, 10, 10);
			ctx.fillText('Opponent: ' + this.state.opponent.score, 700, 10);
		}
		
		return (
			<div style={outerGround} className="outer_ground">
				<div style={dividerLine} className="divider_line"></div>
				<div style={innerGround} className="inner_ground">
					<Canvas 
						draw={draw} 
						width={this.props.width}
						height={this.props.height}
					/>
				</div>
			</div>
		);
	}
}

export default Pong;
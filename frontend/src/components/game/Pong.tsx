import React from 'react';
import Canvas from '../Canvas';
import Ball from './Ball'

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
		speed: number;
	};
	velocity: {
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

const InitialState = () => {
	return {
		ball: {
			x: 100,
			y: 100,
			speed: 2,
		},
		velocity: {
			x: 0,
			y: 0,
		},
		player: {
			x: 10,
			y: 100,
			score: 0,
		},
		opponent: {
			x: 670,
			y: 100,
			score: 0,
		},
	}
}

class Pong extends React.Component<PongProps, PongState> {
	constructor(props: PongProps) {
		super(props);
		this.state = InitialState();
	}

	renderBall() {
		return (
			<Ball 
				// state={this.state}
				// props={this.props}
			/>

		)
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
			ctx.fillRect(0, 0, this.props.width, this.props.height);
			ctx.save();
			ctx.fillStyle = '#6EB0D9';

			// draw scoreboard
			ctx.font = '10px Arial';
			ctx.fillText('Player: ' + this.state.player.score, 10, 10);
			ctx.fillText('Opponent: ' + this.state.opponent.score, 500, 10);

			this.renderBall();
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
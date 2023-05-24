import { useState, useEffect } from 'react';
import classes from '../../sass/components/Game/Liveboard.module.scss';

type LiveBoardProps = {
	isReady: boolean;
	username: string;
	opponentName: string;
	start(): void;
}

interface State {
	time: number;
	seconds: number;
}

export default function LiveBoard({ isReady, username, opponentName, start }: LiveBoardProps) {
	const [state, setState] = useState<State>({
		time: 3,
		seconds: 3,
	});

	// set a countdown of 3 seconds
	useEffect(() => {
		if (isReady) {
			setTimeout(() => {
				if (state.time === 0) {
					return ;
				}
	
				setState({
					time: state.time - 1,
					seconds: state.time - Math.floor((state.time) / 60) * 60 - 1,
				});
			}, 1000);
		}
		// when the countdown finished, trigger the animation of the game to start
		if (state.seconds === 0) {
			start();
		}
	}, [state.time, isReady]);

	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{!isReady && (
					<>
						<h2>Welcome to live battle!!</h2>
						<p>Please wait for your opponent ...</p>
					</>
				)}
				{isReady && (
					<>
						<h1>{username} VS {opponentName}</h1>
						<h2>{state.seconds}</h2>
					</>
				)}
			</div>
		</div>
	);
}
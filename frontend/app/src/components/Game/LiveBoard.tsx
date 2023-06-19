import { useState, useEffect } from 'react';
import { LiveBoardProps, State } from './utils/types';
import classes from '../../sass/components/Game/Board.module.scss';

export default function LiveBoard({ isReady, playerName, opponentName, spectatorMode, closingText, start }: LiveBoardProps) {
	const [isEnded, setIsEnded] = useState(closingText === '' ? false : true);
	const [state, setState] = useState<State>({
		time: 3,
		seconds: 3,
	});

	// set a countdown of 3 seconds
	useEffect(() => {
		if (!spectatorMode) {
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
		}
		else {
			if (isReady) {
				start();
			}
		}
	}, [state.time, isReady]);

	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{(!isReady && spectatorMode && !isEnded) && (
					<>
						<h2>Welcome to live battle!!</h2>
						<h1>{playerName} VS {opponentName}</h1>
						<p>loading ...</p>
					</>
				)}
				{(spectatorMode && isEnded) && (
					<>
						<h2>The game has ended!</h2>
						<h1>{closingText}</h1>
						{/* <button onClick={}>Return to hompage</button> */}
					</>
				)}
				{(!isReady && !spectatorMode) && (
					<>
						<h2>Welcome to live battle!!</h2>
						<p>Please wait for your opponent ...</p>
					</>
				)}
				{(isReady && !spectatorMode) && (
					<>
						<h1>{playerName} VS {opponentName}</h1>
						<h2>{state.seconds}</h2>
					</>
				)}
			</div>
		</div>
	);
}
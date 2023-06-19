import { useState } from 'react';
import classes from '../../sass/components/Game/Board.module.scss';

export default function PausedBoard({ spectatorMode }: { spectatorMode: boolean }) {
	const [text, setText] = useState('');
	if (spectatorMode) {
		setText("Please wait for the players to continue the game");
	} else {
		setText("Press 'spacebar' to continue playing");
	}
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<>
					<h2>Game is paused</h2>
					<p>{text}</p>
				</>
			</div>
		</div>
	);
}
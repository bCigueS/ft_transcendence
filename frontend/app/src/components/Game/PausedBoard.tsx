import classes from '../../sass/components/Game/Board.module.scss';
import { PausedProps } from './utils/types';

export default function PausedBoard({ mode }: PausedProps) {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{(mode === 'spectator') && (
					<>
						<h2>Game is paused</h2>
						<p>Please wait for the players to continue the game</p>
					</>
				)}
				{(mode === 'play') && (
					<>
						<h2>Game is paused</h2>
						<p>Press 'spacebar' to continue playing</p>
					</>
				)}
			</div>
		</div>
	);
}
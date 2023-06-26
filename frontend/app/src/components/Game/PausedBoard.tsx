import classes from '../../sass/components/Game/Board.module.scss';
import { PausedProps } from './utils/types';

export default function PausedBoard({ text }: PausedProps) {
	
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<h2>Game is paused</h2>
				<p>{text}</p>
			</div>
		</div>
	);
}
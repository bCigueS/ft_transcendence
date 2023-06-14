import classes from '../../sass/components/Game/Board.module.scss';

export default function PausedBoard() {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<>
					<h2>Game is paused</h2>
					<p>Press 'spacebar' to continue playing</p>
				</>
			</div>
		</div>
	);
}
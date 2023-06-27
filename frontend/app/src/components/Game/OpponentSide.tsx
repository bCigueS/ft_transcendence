import classes from '../../sass/components/Game/OpponentSide.module.scss';

export default function OpponentSide({ opponentName }: { opponentName: string | undefined }) {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<h1>{opponentName}</h1>
			</div>
		</div>
	);
}
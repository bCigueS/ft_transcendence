import classes from '../../sass/components/Game/PlayerSide.module.scss';

export default function PlayerSide({ playerName }: { playerName: string }) {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<h1>{playerName}</h1>
			</div>
			{/* <div className={classes.divider_line}></div> */}
		</div>
	);
}
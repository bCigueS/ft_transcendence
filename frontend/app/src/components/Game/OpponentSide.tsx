import classes from '../../sass/components/Game/OpponentSide.module.scss';
import { UserAPI } from '../../store/users-contexte';
import ProfilIcon from '../Profile/ProfilIcon';

export default function OpponentSide({ opponent, opponentName }: { opponent: UserAPI | undefined, opponentName: string | undefined }) {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<h1>{opponentName}</h1>
			</div>
			<div className={classes.icon}>
				{(opponent || opponentName === 'Computer') && (
					<ProfilIcon user={opponent} displayCo={false}/>
				)}
			</div>
		</div>
	);
}
import classes from '../../sass/components/Game/PlayerSide.module.scss';
import { UserAPI } from '../../store/users-contexte';
import ProfilIcon from '../Profile/ProfilIcon';

export default function PlayerSide({ player }: { player: UserAPI | null | undefined }) {
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				<h1>{player?.name}</h1>
			</div>
			<div className={classes.icon}>
				<ProfilIcon user={player} />
			</div>
		</div>
	);
}
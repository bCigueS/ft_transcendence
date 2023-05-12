import React from 'react';

import classes from '../../../sass/components/Profile/Matches/MatchSummary.module.scss'
import { UserMatch, User } from '../../../store/users-contexte';
import ProfilIcon from '../ProfilIcon';


const MatchSummary: React.FC<{summary: UserMatch; user?: User}> = (props) => {
	return (
		<div className={classes.container}>

			
			<div className={classes.card}>
				<ProfilIcon user={props.user} />
				<div>
					<h1>{props.user?.name}</h1>
				</div>
			</div>

			<div className={classes.score}>
				<h1>{props.summary.playerScore}:{props.summary.opponentScore}</h1>
			</div>

			<div className={classes.cardM}>
				<ProfilIcon user={props.summary.opponent} />
				<div className={classes.info}>
					<h1>{props.summary.opponent.name}</h1>
				</div>
			</div>
		</div>
	);
};

export default MatchSummary;
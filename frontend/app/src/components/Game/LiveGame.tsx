import React from 'react';
import classes from '../../sass/components/Game/Livegame.module.scss';
import { UserMatch } from '../../store/users-contexte';
import MatchSummary from '../Profile/Matches/MatchSummary';



const DUMMY_MATCHS: UserMatch[] = [
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
]

const Livegame: React.FC = () => {
	return (
		<div className={classes.container}>
			<h1>Live Games</h1>
			<div className={classes.matchs}>
				{
					DUMMY_MATCHS.map((match, i) => (
						<MatchSummary key={i} summary={match}/>
					))
				}
			</div>
		</div>
	)
}

export default Livegame;

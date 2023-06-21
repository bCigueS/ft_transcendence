import React from 'react';
import classes from '../../sass/components/Game/Livegame.module.scss';
import { UserMatch } from '../../store/users-contexte';
import LiveGameCard from './LiveGameCard';

// interface Props {
// }


const DUMMY_MATCHS: UserMatch[] = [
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
	{playerScore: 0, opponentScore: 0},
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
						<LiveGameCard key={i}/>
					))
				}
			</div>
		</div>
	)
}

export default Livegame;

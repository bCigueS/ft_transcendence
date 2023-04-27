import React, { useState } from 'react';

import classes from '../../sass/components/Profil/ProfilContent.module.scss';
import MatchSummary from './Matches/MatchSummary';

interface matchSummaryContent  {
	imgP: string,
	imgO: string,
	nameP: string,
	nameO: string,
	statusP: string,
	statusO: string,
	score: string
}

const ProfilContent: React.FC = () => {

	const exempleSummary: matchSummaryContent = {
		imgP: 'imgProfil',
		imgO: 'imgProfil',
		nameP: 'Sbeylot',
		nameO: 'Rebelle',
		statusP: 'Winner',
		statusO: 'Looser',
		score: '2:4'
	};

	const [contentDisplay, setContentDisplay] = useState<string>('Matchs');

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		console.log(event.currentTarget.textContent);
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	};

	return (
		<div className={classes.container}>
			<div className={classes.tab}>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Matchs' ? classes.active : ''}`}
					onClick={tabHandler}>
						Matchs
				</button>
				<button className={`${classes.btn} ${contentDisplay !== 'Matchs' ? classes.active : ''}`} 
					onClick={tabHandler}>Friends</button>
			</div>
			{
				contentDisplay === 'Matchs' &&
				<div className={classes.tabContent}>
					<div className={classes.test}>
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
						<MatchSummary summary={exempleSummary} />
					</div>
				</div>
			}
			{
				contentDisplay === 'Friends' &&
				<div className={classes.tabContent}>
					<h1>Friends</h1>
				</div>
			}
		</div>
	);
};

export default ProfilContent;
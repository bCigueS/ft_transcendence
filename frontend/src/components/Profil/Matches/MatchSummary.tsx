import React from 'react';

import classes from '../../../sass/components/Profil/Matches/MatchSummary.module.scss'

interface matchSummaryContent  {
	imgP: string,
	imgO: string,
	nameP: string,
	nameO: string,
	statusP: string,
	statusO: string,
	score: string
}

const MatchSummary: React.FC<{summary: matchSummaryContent}> = (props) => {
	return (
		<div className={classes.container}>
			<div className={classes.card}>
				<div className={classes.img}>{props.summary.imgP}</div>
				<div>
					<h1>{props.summary.nameP}</h1>
					{/* <p>{props.summary.statusP}</p>  */}
				</div>
			</div>
			<div className={classes.score}>
				<h1>{props.summary.score}</h1>
			</div>
			<div className={classes.cardM}>
				<div className={classes.info}>
					<h1>{props.summary.nameO}</h1>
					{/* <p>{props.summary.statusO}</p> */}
				</div>
				<div className={classes.img}>{props.summary.imgO}</div>
			</div>
		</div>
	);
};

export default MatchSummary;
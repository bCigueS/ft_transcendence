import React from 'react';

import classes from '../../../sass/components/Profil/Matches/MatchSummary.module.scss'

const MatchSummary: React.FC = () => {
	return (
		<div className={classes.container}>
			<div>
				<div>Image</div>
				<h1>Name</h1>
				<p>Status (Winner looser)</p>
			</div>
			<div>
				<h1>10:0</h1>
			</div>
		</div>
	);
};

export default MatchSummary;
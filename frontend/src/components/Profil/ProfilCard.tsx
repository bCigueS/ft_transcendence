import React from 'react';

import classes from '../../sass/components/Profil/ProfilCardInfo.module.scss';

const ProfilCard: React.FC = () => {
	return (
		<div className={classes.container}>
			<div className={classes.picture}></div>
			<div className={classes.user}>
				<h1>Sbeylot</h1>
				<p>Simon Beylot</p>
			</div>
			<div className={classes.stat}>
				<div className={classes.info}>
					<i className="fa-solid fa-trophy"></i>
					<p>0</p>
				</div>
				<div className={classes.info}>
					<i className="fa-solid fa-bolt"></i>
					<p>0</p>
				</div>
				<div className={classes.info}>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					<p>0</p>
				</div>
			</div>
		</div>

	);
};

export default ProfilCard;
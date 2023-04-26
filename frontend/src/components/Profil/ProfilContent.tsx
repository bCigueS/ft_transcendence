import React, { useState } from 'react';

import classes from '../../sass/components/Profil/ProfilContent.module.scss';

const ProfilContent: React.FC = () => {
	const [contentDisplay, setContentDisplay] = useState<string>('Matchs');

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		console.log(event.currentTarget.textContent);
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	}

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
					<h1>Matchs</h1>
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
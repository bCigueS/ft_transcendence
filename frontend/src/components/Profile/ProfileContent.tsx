import React, { useState, useContext } from 'react';

import classes from '../../sass/components/Profile/ProfileContent.module.scss';
import MatchSummary from './Matches/MatchSummary';
import ProfileFriends from './ProfileFriends';
import { UserContext } from '../../store/users-contexte';

interface matchSummaryContent  {
	imgP: string,
	imgO: string,
	nameP: string,
	nameO: string,
	statusP: string,
	statusO: string,
	score: string
}

const ProfileContent: React.FC = () => {

	const userCtx = useContext(UserContext);

	const exempleSummary: matchSummaryContent = {
		imgP: '',
		imgO: '',
		nameP: 'Sbeylot',
		nameO: 'Rebelle',
		statusP: 'Winner',
		statusO: 'Looser',
		score: '2:4'
	};

	const [contentDisplay, setContentDisplay] = useState<string>('Friends');

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
					<div className={classes.test}>
						{
							userCtx.user.friends.map((friend) => (
								<ProfileFriends friend={friend} />
							))
						}
					</div>
				</div>
			}
		</div>
	);
};

export default ProfileContent;
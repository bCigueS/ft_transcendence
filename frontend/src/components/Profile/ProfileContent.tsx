import React, { useState, useContext } from 'react';

import classes from '../../sass/components/Profile/ProfileContent.module.scss';
import MatchSummary from './Matches/MatchSummary';
import ProfileFriends from './ProfileFriends';
import { User, UserContext } from '../../store/users-contexte';
import ProfilSettings from './ProfilSettings';

const ProfileContent: React.FC = () => {

	const userCtx = useContext(UserContext);


	const [contentDisplay, setContentDisplay] = useState<string>('Settings');

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	};

	const isFriend = (user: User) => {
		return userCtx.user.friends.includes(user);
	}

	const isBlock = (user: User) => {
		return userCtx.user.block.includes(user);
	}

	return (
		<div className={classes.container}>

			{/* Tabs content */}
			<div className={classes.tab}>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Matchs' ? classes.active : ''}`}
					onClick={tabHandler}>
						Matchs
				</button>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Friends' ? classes.active : ''}`} 
					onClick={tabHandler}>
						Friends
				</button>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Block' ? classes.active : ''}`} 
					onClick={tabHandler}>
						Block
				</button>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Settings' ? classes.active : ''}`} 
					onClick={tabHandler}>
						Settings
				</button>
			</div>

			{/* Content */}
			{
				contentDisplay === 'Matchs' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user.matchs.map((match, index) => (
								<MatchSummary key={index} summary={match} user={userCtx.user} />
							))
						}
					</div>
				</div>
			}

			{
				contentDisplay === 'Friends' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user.friends.map((friend) => (
								!isBlock(friend) && <ProfileFriends 
									key={friend.nickname} 
									user={friend} 
									block={isBlock(friend)}
									friend={isFriend(friend)} />
							))
						}
					</div>
				</div>
			}

			{
				contentDisplay === 'Block' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user.block.map((block) => (
								<ProfileFriends 
									key={block.nickname} 
									user={block} 
									block={isBlock(block)} 
									friend={isFriend(block)}/>
							))
						}
					</div>
				</div>
			}
			{
				contentDisplay === 'Settings' &&
				<div className={classes.tabContent}>
					<ProfilSettings user={userCtx.user}/>
				</div>
			}
		</div>
	);
};

export default ProfileContent;
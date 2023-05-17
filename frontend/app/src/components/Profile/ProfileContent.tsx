import React, { useState, useContext, useEffect } from 'react';

import classes from '../../sass/components/Profile/ProfileContent.module.scss';
import MatchSummary from './Matches/MatchSummary';
import ProfileFriends from './ProfileFriends';
import { User, UserAPI, UserContext } from '../../store/users-contexte';
import ProfilSettings from './ProfilSettings';
// import { useParams } from 'react-router-dom';


const ProfileContent: React.FC<{ user?: UserAPI | null }> = ({ user }) => {

	const userCtx = useContext(UserContext);
	const [contentDisplay, setContentDisplay] = useState<string>('Friends');

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	};

	// const isFriend = (user: User) => {
	// 	return userCtx.user.friends.includes(user);
	// }

	// const isBlock = (user: User) => {
	// 	return userCtx.user.block.includes(user);
	// }


	console.log("List of friends inside component: ", userCtx.user?.friends);
	useEffect(() => {
		setContentDisplay('Friends');
	}, [user?.name])

	return (
		<div className={classes.container}>

			{/* Tabs content */}
			<div className={classes.tab}>
				{/* <button 
					className={`${classes.btn} ${contentDisplay === 'Matchs' ? classes.active : ''}`}
					onClick={tabHandler}>
						Matchs
				</button> */}
				{	user === userCtx.user &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Friends' ? classes.active : ''}`} 
						onClick={tabHandler}>
							Friends
					</button>
				}
				{	user === userCtx.user &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Block' ? classes.active : ''}`} 
						onClick={tabHandler}>
						Block
					</button>
				}
				{
					user === userCtx.user &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Settings' ? classes.active : ''}`} 
						onClick={tabHandler}>
						Settings
					</button>
				}
			</div>

			{/* Content */}
			{/* {
				contentDisplay === 'Matchs' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							user?.matchs.map((match, index) => (
								<MatchSummary key={index} summary={match} user={user} />
							))
						}
					</div>
				</div>
			} */}
			
			{
				(contentDisplay === 'Friends' && user === userCtx.user) &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user?.friends && 
							userCtx.user.friends.map((friend) => (
									<ProfileFriends 
									key={friend.name} 
									user={friend} 
									block={false}
									friend={true} />
							))
						}
					</div>
				</div>
			}

			{/* {
				(contentDisplay === 'Block' && user === userCtx.user) &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user.block && 
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
				(contentDisplay === 'Settings' && user === userCtx.user) &&
				<div className={classes.tabContent}>
					<ProfilSettings user={userCtx.user}/>
				</div>
			} */}
		</div>
	);
};

export default ProfileContent;
import React, { useState, useContext, useEffect, useCallback } from 'react';
import classes from '../../sass/components/Profile/ProfileContent.module.scss';
import MatchSummary from './Matches/MatchSummary';
import ProfileFriends from './ProfileFriends';
import { UserAPI, UserContext, UserMatch } from '../../store/users-contexte';
import ProfilSettings from './ProfilSettings';


const ProfileContent: React.FC<{ user?: UserAPI | null }> = ({ user }) => {

	const userCtx = useContext(UserContext);
	const [contentDisplay, setContentDisplay] = useState<string>('Maths');
	const [ matchesSummary, setMatchesSummary ] = useState<UserMatch[]>([]);

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	};

	const fetchUser = async(id: number) => {
		const response = await fetch('http://localhost:3000/users/' + id);
		if (!response.ok)
			throw new Error("Failed to fetch user");
		const data = await response.json();
		const user: UserAPI = {
			id: data.id,
			name: data.name,
			email: data.email,
			avatar: data.avatar,
			doubleAuth: data.doubleAuth,
			wins: data.wins
		}
		return user;
	}

	const parseMatchData = async (match: any) => {
		console.log(match);

		const idOfUser: number = match.players[0].userId === userCtx.user?.id ? 0 : 1;
		const idOfOppo: number = match.players[0].userId === userCtx.user?.id ? 1 : 0;
		const matchInfo: UserMatch = {
			user: await fetchUser(match.players[idOfUser].userId),
			opponent: await fetchUser(match.players[idOfOppo].userId),
			playerScore: match.players[idOfUser].score,
			opponentScore: match.players[idOfOppo].score
		}

		console.log(matchInfo);
	}

	const fetchMatchSummary = useCallback(async() => {
		const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/games');
		if (response.status === 404) {
			console.error("Error in fetch data");
			return ;
		}
		if (!response.ok)
			throw new Error("Failed to fetch matchs Summary");
		const data = await response.json();
		const matchsSummary: UserMatch[] = data.map((match: any) => {
			// return {
			// 	// opponent: data.
			// }
			return (parseMatchData(match));
		})
		
		console.log("Result: ", matchesSummary);
	}, [])

	useEffect(() => {
		setContentDisplay('Settings');
		fetchMatchSummary();
	}, [user?.name]);

	return (
		<div className={classes.container}>

			{/* Tabs content */}
			<div className={classes.tab}>
				<button 
					className={`${classes.btn} ${contentDisplay === 'Matchs' ? classes.active : ''}`}
					onClick={tabHandler}>
						Matchs
				</button>
				{	user?.id === userCtx.user?.id &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Friends' ? classes.active : ''}`} 
						onClick={tabHandler}>
							Friends
					</button>
				}
				{	user?.id === userCtx.user?.id &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Block' ? classes.active : ''}`} 
						onClick={tabHandler}>
						Block
					</button>
				}
				{
					user?.id === userCtx.user?.id &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Settings' ? classes.active : ''}`} 
						onClick={tabHandler}>
						Settings
					</button>
				}
			</div>

			{/* Content */}
			{
				contentDisplay === 'Matchs' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							user?.matchs?.map((match, index) => (
								<MatchSummary key={index} summary={match} user={user} />
							))
						}
					</div>
				</div>
			}
			
			{
				(contentDisplay === 'Friends' && user?.id === userCtx.user?.id) &&
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

			{
				(contentDisplay === 'Block' && user?.id === userCtx.user?.id) &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							userCtx.user?.block && 
							userCtx.user?.block.map((block) => (
								<ProfileFriends 
									key={block.name} 
									user={block}
									block={true}
									friend={false}/>
							))
						}
					</div>
				</div>
			}
			{
				(contentDisplay === 'Settings' && user?.id === userCtx.user?.id) &&
				<div className={classes.tabContent}>
					<ProfilSettings user={userCtx.user}/>
				</div>
			}
		</div>
	);
};

export default ProfileContent;


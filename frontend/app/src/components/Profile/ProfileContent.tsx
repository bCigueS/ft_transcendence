import React, { useState, useContext, useEffect, useCallback } from 'react';
import classes from '../../sass/components/Profile/ProfileContent.module.scss';
import MatchSummary from './Matches/MatchSummary';
import ProfileFriends from './ProfileFriends';
import { UserAPI, UserContext, UserMatch } from '../../store/users-contexte';
import ProfilSettings from './ProfilSettings';
import DoubleAuthPannel from '../Auth/DoubleAuthPannel';


const ProfileContent: React.FC<{ user?: UserAPI | null }> = ({ user }) => {

	const userCtx = useContext(UserContext);
	const [contentDisplay, setContentDisplay] = useState<string>('Maths');
	const [ matchesSummary, setMatchesSummary ] = useState<UserMatch[]>([]);

	const tabHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const display: string = event.currentTarget.textContent || '';
		setContentDisplay(display);
	};

	const fetchUser = useCallback(async(id: number) => {
		let gamePlayed;
		const response = await fetch('http://localhost:3000/users/' + id, {
			method: 'GET', 
			headers: {
				'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
			}
		});
		if (!response.ok)
			throw new Error("Failed to fetch user");
		gamePlayed = await userCtx.fetchGamePlayed(id);
		const data = await response.json();
		const user: UserAPI = {
			id: data.id,
			name: data.name,
			email: data.email,
			avatar: data.avatar,
			doubleAuth: data.doubleAuth,
			wins: data.wins,
			gamesPlayed: gamePlayed,
			connected: data.status === 1 ? true : false,
		}
		return user;
	},[userCtx])

	const parseMatchData = useCallback(async (match: any) => {

		const idOfUser: number = match.players[0].userId === userCtx.user?.id ? 0 : 1;
		const idOfOppo: number = match.players[0].userId === userCtx.user?.id ? 1 : 0;
		let levelMatch: string;
		switch(match.level)
		{
			case 0:
				levelMatch = "easy";
				break;
			case 1:
				levelMatch = "medium";
				break;
			case 2:
				levelMatch = "hard";
				break;
			default:
				levelMatch = "special";
				break;
		}
	
		const matchInfo: UserMatch = {
			user: await fetchUser(match.players[idOfUser].userId),
			opponent: await fetchUser(match.players[idOfOppo].userId),
			playerScore: match.players[idOfUser].score,
			opponentScore: match.players[idOfOppo].score,
			level: levelMatch
		}

		return matchInfo;
	},[fetchUser, userCtx.user?.id]);

	const fetchMatchSummary = useCallback(async() => {
		if (user?.id === undefined)
			return ;
		const response = await fetch('http://localhost:3000/users/' + user?.id + '/games', {
			method: 'GET',
			headers: {
				'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
			}
		});
		if (response.status === 404) {
			console.error("Error in fetch data");
			return ;
		}
		if (!response.ok)
			throw new Error("Failed to fetch matchs Summary");
		const data = await response.json();
		let matchArray: UserMatch[] = [];

		await Promise.all(data.map(async (match: UserMatch) => {
			const parsedMatch = await parseMatchData(match);
			matchArray = [...matchArray, parsedMatch];
		  }));

		setMatchesSummary(matchArray);
	}, [user?.id, userCtx.logInfo?.token, parseMatchData])

	useEffect(() => {
		setContentDisplay('Matchs');
		fetchMatchSummary();
	}, [user?.name, user?.id, fetchMatchSummary]);

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
				{
					user?.id === userCtx.user?.id &&
					<button 
						className={`${classes.btn} ${contentDisplay === 'Auth' ? classes.active : ''}`} 
						onClick={tabHandler}>
						Auth
					</button>
				}
			</div>
			
			{
				contentDisplay === 'Matchs' &&
				<div className={classes.tabContent}>
					<div className={classes.listContent}>
						{
							matchesSummary.map((match, index) => (
								<MatchSummary key={index} summary={match} user={match.user}/>
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
			{
				(contentDisplay === 'Auth' && user?.id === userCtx.user?.id) &&
				<div className={classes.tabContent}>
					<DoubleAuthPannel />
				</div>
			}
		</div>
	);
};

export default ProfileContent;


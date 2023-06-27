// Basic Inports
import { useCallback, useContext, useEffect, useState } from 'react';

//	Components Inports
import LeaderboardProfil from '../components/Leaderboard/LeaderboardProfil';
import Searchbar from '../components/Leaderboard/Searchbar';
import FilterSearch from '../components/Leaderboard/FilterSearch';

//	Context Inport
import { UserAPI, UserContext } from '../store/users-contexte';

//	Functions Inport
import * as sortU from '../typescript/sortUsers';

//	Style Import
import classes from '../sass/pages/Leaderboard.module.scss';


export default function Leaderboard() {

	const userCtx = useContext(UserContext);
	const [searchInput, setSearchInput] = useState('');
	const [filterOption, setFilterOption] = useState('');
	const [userCommunity, setUserCommunity] = useState<UserAPI[]>([]);

	const saveSearchInput = (enteredSearchInput: string) => {
		setSearchInput(enteredSearchInput);
	};

	const saveFilterOption = (enteredFilterOption: string) => {
		setFilterOption(enteredFilterOption);
	};
	const fetchCommunity = useCallback(async() => {
		try {
			const response = await fetch('http://localhost:3000/users/' + userCtx.logInfo?.userId + '/show-community', {
				method: 'GET',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				}
			});
			
			if (!response.ok)
			throw new Error("Failed to fetch show-community")

			const data = await response.json();
			const UserData: UserAPI[] = data.map((user: any) => {
				return {
					id: user.id,
					name: user.name,
					email: user.email,
					avatar: user.avatar,
					doubleAuth: user.doubleAuth,
					wins: user.wins,
					connected: user.status === 1 ? true : false,
				}
			})
			setUserCommunity(UserData);

		} catch(error: any) {
			console.error(error.message);
		}
	}, [userCtx.logInfo?.token, userCtx.logInfo?.userId]);

	useEffect(() => {
		fetchCommunity();
	}, [fetchCommunity, userCtx.user])

	let filteredUser: UserAPI[] = userCommunity;

	if (filterOption === 'Most Wins')
		filteredUser = sortU.winsSortedUser(userCommunity);
	else if (filterOption === 'Less Wins')
		filteredUser = sortU.loosesSortedUser(userCommunity);
	else if (filterOption === 'Most played games')
		filteredUser = sortU.mostPlayedGame(userCommunity);
	else if (filterOption === 'Less played games')
		filteredUser = sortU.lessPlayedGame(userCommunity);
	else if (filterOption === 'Nickname (a-z)')
		filteredUser = sortU.alphaOrderNick(userCommunity);
	else if (filterOption === 'Nickname (z-a)')
		filteredUser = sortU.unAlphaOrderNick(userCommunity);

	const displayUsers: UserAPI[] = filteredUser.filter((user) => (
		user.name.toLowerCase().slice(0, searchInput.length).includes(searchInput.toLowerCase())
	));


	return (
		<div className={classes.page}>
			<div className={classes.searchbar}>
				<Searchbar onSaveSearch={saveSearchInput} />
			</div>
			<div className={classes.filter}>
				<FilterSearch onSaveFilter={saveFilterOption}/>
			</div>
			<div className={classes.content}>
				{	displayUsers.map((user) => (
						<LeaderboardProfil key={user.id} user={user} />
					))
				}
			</div>
		</div>
	)
}
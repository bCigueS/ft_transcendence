// Basic Inports
import { useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';

//	Components Inports
import LeaderboardProfil from '../components/Leaderboard/LeaderboardProfil';
import Searchbar from '../components/Leaderboard/Searchbar';
import FilterSearch from '../components/Leaderboard/FilterSearch';

//	Context Inport
import { UserAPI } from '../store/users-contexte';

//	Functions Inport
import * as sortU from '../typescript/sortUsers';

//	Style Import
import classes from '../sass/pages/Leaderboard.module.scss';


export default function Leaderboard() {

	const [searchInput, setSearchInput] = useState('');
	const [filterOption, setFilterOption] = useState('');
	const userData = useLoaderData() as UserAPI[];

	const saveSearchInput = (enteredSearchInput: string) => {
		setSearchInput(enteredSearchInput);
	};

	const saveFilterOption = (enteredFilterOption: string) => {
		setFilterOption(enteredFilterOption);
	};

	let filteredUser: UserAPI[] = userData;

	if (filterOption === 'Most Wins')
		filteredUser = sortU.winsSortedUser(userData);
	else if (filterOption === 'Less Wins')
		filteredUser = sortU.loosesSortedUser(userData);
	else if (filterOption === 'Most played games')
		filteredUser = sortU.mostPlayedGame(userData);
	else if (filterOption === 'Less played games')
		filteredUser = sortU.lessPlayedGame(userData);
	else if (filterOption === 'Nickname (a-z)')
		filteredUser = sortU.alphaOrderNick(userData);
	else if (filterOption === 'Nickname (z-a)')
		filteredUser = sortU.unAlphaOrderNick(userData);

	const displayUsers: UserAPI[] = filteredUser.filter((user) => (
		user.name.toLowerCase().slice(0, searchInput.length).includes(searchInput.toLowerCase())
	));

	const fetchBlockUser = async() => {
		
	}

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

export const loader = async (): Promise<UserAPI[] | Response> => {
	const response = await fetch('http://localhost:3000/users');

	if (!response.ok) {
		return json({message: "Could not fetch leaderboard"}, { status: 500 });
	} else {
		const data = await response.json();
		const usersData: UserAPI[] = data.map((user: any) => {
			return {
				id: user.id,
				email: user.email,
				name: user.name,
				avatar: user.avatar,
				doubleAuth: user.doubleAuth,
				wins: user.wins
			}
		})
		return usersData;
	}
}
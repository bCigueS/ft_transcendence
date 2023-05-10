import { useContext, useState } from 'react';
import LeaderboardProfil from '../components/Leaderboard/LeaderboardProfil';
import Searchbar from '../components/Leaderboard/Searchbar';
import classes from '../sass/pages/Leaderboard.module.scss';
import { User, UserContext } from '../store/users-contexte';
import FilterSearch from '../components/Leaderboard/FilterSearch';
import * as sortU from '../typescript/sortUsers';


export default function Leaderboard() {

	const userCtx = useContext(UserContext);
	const [searchInput, setSearchInput] = useState('');
	const [filterOption, setFilterOption] = useState('');

	const saveSearchInput = (enteredSearchInput: string) => {
		setSearchInput(enteredSearchInput);
	};

	const saveFilterOption = (enteredFilterOption: string) => {
		setFilterOption(enteredFilterOption);
	};

	let filteredUser: User[] = userCtx.userList;

	if (filterOption === 'Most Wins')
		filteredUser = sortU.winsSortedUser(userCtx.userList);
	else if (filterOption === 'Less Wins')
		filteredUser = sortU.loosesSortedUser(userCtx.userList);
	else if (filterOption === 'Most played games')
		filteredUser = sortU.mostPlayedGame(userCtx.userList);
	else if (filterOption === 'Less played games')
		filteredUser = sortU.lessPlayedGame(userCtx.userList);
	else if (filterOption === 'Nickname (a-z)')
		filteredUser = sortU.alphaOrderNick(userCtx.userList);
	else if (filterOption === 'Nickname (z-a)')
		filteredUser = sortU.unAlphaOrderNick(userCtx.userList);

	const displayUsers: User[] = filteredUser.filter((user) => (
		user.nickname.toLowerCase().slice(0, searchInput.length).includes(searchInput.toLowerCase())
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
				{
					displayUsers.map((user) => (
						<LeaderboardProfil key={user.nickname}user={user} />
					))
				}
			</div>
		</div>
	)
}
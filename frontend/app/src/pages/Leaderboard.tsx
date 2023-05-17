import { useCallback, useContext, useEffect, useState } from 'react';
import LeaderboardProfil from '../components/Leaderboard/LeaderboardProfil';
import Searchbar from '../components/Leaderboard/Searchbar';
import classes from '../sass/pages/Leaderboard.module.scss';
import { User, UserAPI, UserContext } from '../store/users-contexte';
import FilterSearch from '../components/Leaderboard/FilterSearch';
import * as sortU from '../typescript/sortUsers';


export default function Leaderboard() {

	const userCtx = useContext(UserContext);
	const [searchInput, setSearchInput] = useState('');
	const [filterOption, setFilterOption] = useState('');
	const [ usersList, setUserList ] = useState<UserAPI[]>([]);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | null>(null);
	
	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('http://localhost:3000/users');
			const data = await response.json();

			if (!response.ok)
				throw new Error('Error while fetching users!');
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
			setUserList(usersData);
			setIsLoading(false);
		}
		catch ( error: any ) {
			setError(error.message);
		}
	}, []);
	
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);


	const saveSearchInput = (enteredSearchInput: string) => {
		setSearchInput(enteredSearchInput);
	};

	const saveFilterOption = (enteredFilterOption: string) => {
		setFilterOption(enteredFilterOption);
	};

	let filteredUser: UserAPI[] = usersList;

	if (filterOption === 'Most Wins')
		filteredUser = sortU.winsSortedUser(usersList);
	else if (filterOption === 'Less Wins')
		filteredUser = sortU.loosesSortedUser(usersList);
	else if (filterOption === 'Most played games')
		filteredUser = sortU.mostPlayedGame(usersList);
	else if (filterOption === 'Less played games')
		filteredUser = sortU.lessPlayedGame(usersList);
	else if (filterOption === 'Nickname (a-z)')
		filteredUser = sortU.alphaOrderNick(usersList);
	else if (filterOption === 'Nickname (z-a)')
		filteredUser = sortU.unAlphaOrderNick(usersList);

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
				{	isLoading ? <p>Is Loading</p> : displayUsers.map((user) => (
						<LeaderboardProfil key={user.id} user={user} />
					))
				}
			</div>
		</div>
	)
}
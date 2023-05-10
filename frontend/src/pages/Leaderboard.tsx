import { useContext, useState } from 'react'
import LeaderboardProfil from '../components/Leaderboard/LeaderboardProfil'
import Searchbar from '../components/Leaderboard/Searchbar'
import classes from '../sass/pages/Leaderboard.module.scss'
import { User, UserContext } from '../store/users-contexte'



export default function Leaderboard() {

	const userCtx = useContext(UserContext);
	const [searchInput, setSearchInput] = useState('');

	const saveSearchInput = (enteredSearchInput: string) => {
		setSearchInput(enteredSearchInput);
	}

	console.log(searchInput)
	const displayUsers: User[] = userCtx.userList.filter((user) => (
		user.nickname.toLowerCase().slice(0, searchInput.length).includes(searchInput.toLowerCase())
	));

	console.log(displayUsers);
	console.log("Test", userCtx.userList.filter((user) => (
		user.nickname.toLowerCase().slice(0, searchInput.length).includes(searchInput.toLowerCase())
	)))

	return (
		<div className={classes.page}>
			<div className={classes.searchbar}>
				<Searchbar onSaveSearch={saveSearchInput} />
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
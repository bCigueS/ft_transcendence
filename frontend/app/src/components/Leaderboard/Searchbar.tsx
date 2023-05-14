import React, { useEffect, useState } from 'react';

import classes from '../../sass/components/Leaderboard/Searchbar.module.scss';

const Searchbar: React.FC<{onSaveSearch: (input: string) => void}> = ( props ) => {

	const [enteredInput, setEnteredInput] = useState('');

	const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredInput(event.target.value);
	}

	useEffect(() => {
		props.onSaveSearch(enteredInput);
	}, [enteredInput, props])

	return (
		<div className={classes.container}>
			<label htmlFor="search">
				<div className={classes.circle}>
					<i className='fa-solid fa-magnifying-glass'></i>
				</div>
			</label>
			<input type="text" id='search' className={classes.input} onChange={inputHandler} />
		</div>
	)
}

export default Searchbar;
import React, { useEffect, useState, useRef } from 'react';
import classes from '../../sass/components/Leaderboard/FilterSearch.module.scss';

interface FilterOpt {
	text: string,
	option: string
}

const FilterSearch: React.FC<{onSaveFilter: (input: string) => void}> = ( props ) => {
	const [enteredFilter, setEnteredFilter] = useState('');
	const filterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}
		
		window.addEventListener('mousedown', handleOutsideClick);
		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [filterRef]);
	
	const filterOption: FilterOpt[] = [
		{text: "Most Wins", option: ""},
		{text: "Less Wins", option: ""},
		{text: "Most played games", option: ""},
		{text: "Less played games", option: ""},
		{text: "Nickname (a-z)", option: ""},
		{text: "Nickname (z-a)", option: ""}
	];

	const [menuOpen, setMenuOpen] = useState(false);

	const menuHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		setMenuOpen(!menuOpen);
	};

	const filterHandler = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		setEnteredFilter(event.currentTarget.innerText);
		setMenuOpen(false);
	};

	useEffect(() => {
		props.onSaveFilter(enteredFilter);
	}, [enteredFilter, props])

	return (
		<div className={classes.container} ref={filterRef}>
			<i 
				className='fa-solid fa-filter'
				onClick={menuHandler}
				></i>
			{
				menuOpen && (
					<div className={classes.menu}>
						<ul>
							{
								filterOption.map(item => (
									<li key={item.text} onClick={filterHandler}>{item.text}</li>	
								))
							}
						</ul>
					</div>
				)
			}
		</div>
	)
}

export default FilterSearch;
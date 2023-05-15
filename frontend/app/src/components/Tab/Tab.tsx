import React, { useState } from 'react';

interface TabProps {
	titles: string[];
	contents: React.ReactNode[];
}

const Tab: React.FC<TabProps> = ({ titles, contents }) => {

	const [activeTabIndex, setActiveTabIndex] = useState(0);

	const tabClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const index = parseInt(event.currentTarget.getAttribute('key') || '0');
		setActiveTabIndex(index);
	}

	return (
		<div>
			{
				titles.map((title, index) => (
					<div key={index} onClick={tabClickHandler}>
						{title}
					</div>
				))
			}
			<div>
				{contents[activeTabIndex]}
			</div>
		</div>
	)
}

export default Tab;
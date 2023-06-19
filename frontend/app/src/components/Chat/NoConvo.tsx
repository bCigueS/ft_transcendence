import React, { useEffect, useState } from 'react';

import classes from '../../sass/components/Chat/NoConvo.module.scss';

const NoConvo: React.FC<{ }> = ( {  } ) => {

	return (
		<div className={classes.container}>
			{/* <div className={classes.group}>
				<h4>Or click here to create a group</h4>
			</div> */}
			<div className={classes.noconvo}>
				<h1>Select a chat</h1>
			</div>
		</div>
	)
}

export default NoConvo;
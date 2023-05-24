import React, { useEffect, useState } from 'react';

import classes from '../../sass/components/Chat/NoConvo.module.scss';

const NoConvo: React.FC<{ }> = ( {  } ) => {

	return (
		<div className={classes.noConvo}>
			no convo selected
		</div>
	)
}

export default NoConvo;
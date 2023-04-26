import React from 'react';
import ProfilCardInfo from '../components/Profil/ProfilCard';
import ProfilContent from '../components/Profil/ProfilContent';

import classes from '../sass/pages/Profil.module.scss';

const Profil: React.FC = () => {
	return (
		<div className={classes.profilPage}>
			<ProfilCardInfo></ProfilCardInfo>
			<ProfilContent />
		</div>
		
	);
};

export default Profil;
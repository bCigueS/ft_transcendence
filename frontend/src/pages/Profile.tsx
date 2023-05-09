import React from 'react';
// import { useParams } from 'react-router-dom';
import ProfileCardInfo from '../components/Profile/ProfileCard';
import ProfileContent from '../components/Profile/ProfileContent';

import classes from '../sass/pages/Profile.module.scss';

const Profile: React.FC = () => {
	// const params = useParams();

	return (
		<div className={classes.profilPage}>
			<ProfileCardInfo></ProfileCardInfo>
			<ProfileContent />
		</div>
		
	);
};

export default Profile;
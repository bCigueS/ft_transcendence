import React from 'react';
import ProfilCardInfo from '../components/ProfilCardInfo';
import ProfilMatchHistory from '../components/ProfilMatchHistory';

export default function Profil() {

	return (
		<div style={{
				width: '100%', 
				display: 'flex', 
				justifyContent: 'space-between',
				margin: '2rem'	
			}}>
			<ProfilCardInfo></ProfilCardInfo>
			<ProfilMatchHistory />
		</div>
		
	)
}
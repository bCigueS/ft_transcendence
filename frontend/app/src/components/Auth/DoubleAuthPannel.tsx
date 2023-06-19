import React from 'react';
import classes from '../../sass/components/Auth/DoubleAuthPannel.module.scss';
import QRCode from '../../assets/images/Qrcode_wikipedia_fr_v2clean.png';

const DoubleAuthPannel: React.FC = () => {
	return (
		<div className={classes.container}>
			<h1>Double Authentication</h1>
			<p>Use <span>Google Authenticator</span> to log and play <span>Pong!</span></p>
			<div>
				<img src={QRCode} alt="Qrcode" />
			</div>
		</div>
	)
}

export default DoubleAuthPannel;
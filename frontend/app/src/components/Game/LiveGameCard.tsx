import React from 'react';
import classes from '../../sass/components/Game/LiveGameCard.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { useNavigate } from 'react-router-dom';

const LiveGameCard: React.FC = () => {

	const navigate = useNavigate();
	
	const handleCardNavigate = () => {
		navigate('/pong');
	}

	return (
		<div className={classes.container} onClick={handleCardNavigate}>
			<ProfilIcon />
			<span>VS</span>
			<ProfilIcon />
		</div>
	)
}

export default LiveGameCard;
import React from 'react';
import classes from '../../sass/components/Game/LiveGameCard.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { useNavigate } from 'react-router-dom';
import { UserLiveGames } from '../../store/users-contexte';

const LiveGameCard: React.FC<{ match: UserLiveGames }> = (props) => {
	const navigate = useNavigate();
	
	const handleCardNavigate = () => {
		navigate('/pong', {
			state: {
				playerId: props.match.player?.id,
				opponentId: props.match.opponent?.id,
				gameInvitation: false,
				isInvited: false,
				isSpectator: true,
				gameRoom: props.match.gameRoom,
			}
		});
	}

	return (
		<div className={classes.container} onClick={handleCardNavigate}>
			<ProfilIcon user={props.match.player} />
			<span>VS</span>
			<ProfilIcon user={props.match.opponent}/>
		</div>
	)
}

export default LiveGameCard;
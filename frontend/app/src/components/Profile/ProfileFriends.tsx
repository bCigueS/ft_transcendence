import React, { useContext } from 'react';

import { UserAPI, UserContext } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfileFriends.module.scss';
import ProfilIcon from './ProfilIcon';
import { useNavigate } from 'react-router-dom';

const ProfileFriends: React.FC<{user: UserAPI; block: boolean; friend: boolean}> = ( props ) => {

	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchBlockUser(props.user);
	};

	const removeBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchUnblockUser(props.user);
	};

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchRemoveFriend(props.user);
	}

	const handleClickMessage = () => {

		navigate('/chat', {
			state: {
				newChat: props.user
			}
		});
		
	}

	const handleClickGame = () => {
		navigate('/pong', {
			state: {
				playerId: userCtx.user?.id,
				opponentId: props.user.id,
				gameInvitation: true,
				isInvited: false,
				isSpectator: false,
				gameRoom: undefined,
			}
		})
	}


	return (
		<div className={classes.container}>

			<ProfilIcon user={props.user} displayCo={true}/>

			<div className={classes.info}>
				<h1>{props.user?.name}</h1>
				{
					!props.block && 
					<i 
					onClick={handleClickMessage}
					title='Private Message'
					className='fa-solid fa-message'>
				</i>
				}

			</div>

			<div className={classes.option}>
				<i 
					title={props.block ? "Unblock" : "Block"}
					onClick={props.block ? removeBlockHandler : addBlockHandler}
					className={props.block ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'}>
				</i>
				{
					!props.block && 
					<i 
						title='Friend'
						onClick={removeFriendHandler}
						className={props.friend ? 'fa-solid fa-user-minus' : 'fa-solid fa-user-plus'}>
					</i>
				}
				{
					!props.block && 
					<i
					onClick={handleClickGame}
						title='Game'
						className='fa-solid fa-table-tennis-paddle-ball'>
					</i>
				}
			</div>
		</div>
	)
}

export default ProfileFriends;
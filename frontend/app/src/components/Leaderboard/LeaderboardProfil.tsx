import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { UserAPI, UserContext } from '../../store/users-contexte';
import { useNavigate } from 'react-router-dom';

const LeaderboardProfil: React.FC<{user: UserAPI}> = ( { user }) => {

	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchRemoveFriend(user);
	}

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchAddFriend(user);
	}

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchBlockUser(user);
	}
	  
	const friendIconDisplay = () => {
		if (userCtx.isSelf(user)) {
			return (<i className='fa-solid fa-user' style={{color: 'gray'}}></i>);	
		}
		else if (userCtx.isFriend(user)) {
			return (<i 
						className='fa-solid fa-user-minus'
						onClick={removeFriendHandler}
					></i>);
		}
		else if (!userCtx.isFriend(user)) {
			return (<i 
						className='fa-solid fa-user-plus'
						onClick={addFriendHandler}
					></i>);
		}
	}

	const handleClickMessage = () => {

		navigate('/chat', {
			state: {
				newChat: user
			}
		});
		
	}

	const handleClickGame = () => {
		navigate('/pong', {
			state: {
				opponent: user,
				gameInvitation: true,
			}
		})
	}

	return (
		<div className={classes.container}>
			<ProfilIcon user={user}/>
			<p>{user.name}</p>
			<div className={classes.icon}>
				<i className='fa-solid fa-trophy'>: {user.wins}</i>
				<i onClick={handleClickMessage}
					className='fa-solid fa-message'
					style={ userCtx.isSelf(user) ? {color: 'gray'} : {}} 
				></i>
				{ friendIconDisplay() }
				<i
					className='fa-solid fa-unlock'
					onClick={addBlockHandler}
				></i>
				<i 
					onClick={handleClickGame}
					className='fa-solid fa-table-tennis-paddle-ball'
					style={ userCtx.isSelf(user) ? {color: 'gray'} : {}} 
				></i>
				
			</div>
		</div>
	)
}

export default LeaderboardProfil;
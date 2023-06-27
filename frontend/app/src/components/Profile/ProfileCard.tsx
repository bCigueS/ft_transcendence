import React, { useContext } from 'react';

import { UserAPI, UserContext } from '../../store/users-contexte';

import classes from '../../sass/components/Profile/ProfileCardInfo.module.scss';
import ProfilIcon from './ProfilIcon';
import { useNavigate } from 'react-router-dom';

const ProfileCard: React.FC<{ user?: UserAPI | null}> = ( { user } ) => {

	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		if (user)
			userCtx.fetchBlockUser(user);
	};

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		if (user)
			userCtx.fetchAddFriend(user);
	}

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		if (user)
			userCtx.fetchRemoveFriend(user);
	}
 
	const friendIconDisplay = () => {
		if (user && userCtx.isSelf(user)) {
			return (<i className='fa-solid fa-user' style={{color: 'gray'}}></i>);	
		}
		else if (user && userCtx.isFriend(user)) {
			return (<i 
						className='fa-solid fa-user-minus'
						onClick={removeFriendHandler}
					></i>);
		}
		else if (user && !userCtx.isFriend(user)) {
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

	/*
		Naviagation to the game
	*/
	const handleClickGame = () => {
		navigate('/pong', {
			state: {
				username: userCtx.user?.name
			}
		})
	}

	return (
		<div className={classes.container}>
			<ProfilIcon user={user} displayCo={false} size={['15rem', '15rem']} border={true}/>
			<div className={classes.user}>
				<h1>{user?.name}</h1>
				<p>{user?.email}</p>
			</div>
			<div className={classes.stat}>
				<div className={classes.info}>
					<i className="fa-solid fa-trophy"></i>
					<p>{user?.wins}</p>
				</div>

				<div className={classes.info}>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					<p>{ user?.gamesPlayed }</p>
				</div>
			</div>
			{
				(user && !userCtx.isSelf(user)) && 
				<div className={classes.icon}>
					{ friendIconDisplay() }
					<i 
					className='fa-solid fa-unlock'
					onClick={addBlockHandler}
					></i>
					<i 
					className='fa-solid fa-table-tennis-paddle-ball' onClick={handleClickGame}>
					</i>
					<i 
					className='fa-solid fa-message' onClick={handleClickMessage}>
					</i>
				</div>
			}
		</div>

	);
};

export default ProfileCard;
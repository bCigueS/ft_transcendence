import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { UserAPI, UserContext } from '../../store/users-contexte';
import { useNavigate } from 'react-router-dom';

const LeaderboardProfil: React.FC<{user: UserAPI}> = ( { user }) => {

	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const fetchAddFriend = async () => {
		const friendId = {
			friendId: user.id
		};

		try {
			const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/add-friend', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(friendId)
			});
		
			if (response.status === 400) {
				throw new Error("Failed to add friend!") ;
			}

			if (!response.ok)
				throw new Error("Failed to add friend!") ;
			
			userCtx.fetchUser();
		} catch (error: any) {
			console.error(error.message);
		}
	};

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchRemoveFriend(user);
	}

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		fetchAddFriend();
	}

	const addBlockHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchBlockUser(user);
	}

	const isFriend = () => {
		return userCtx.user?.friends?.some(friend => user.id === friend.id) || false;
	}

	const isSelf = () => {
		return userCtx.user?.id === user.id;
	}
	  
	const friendIconDisplay = () => {
		if (isSelf()) {
			return (<i className='fa-solid fa-user' style={{color: 'gray'}}></i>);	
		}
		else if (isFriend()) {
			return (<i 
						className='fa-solid fa-user-minus'
						onClick={removeFriendHandler}
					></i>);
		}
		else if (!isFriend()) {
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
					style={ isSelf() ? {color: 'gray'} : {}} 
				></i>
				{ friendIconDisplay() }
				<i
					className='fa-solid fa-unlock'
					onClick={addBlockHandler}
				></i>
				<i 
					onClick={handleClickGame}
					className='fa-solid fa-table-tennis-paddle-ball'
					style={ isSelf() ? {color: 'gray'} : {}} 
				></i>
				
			</div>
		</div>
	)
}

export default LeaderboardProfil;
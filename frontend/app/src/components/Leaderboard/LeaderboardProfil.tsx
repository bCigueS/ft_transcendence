import React, { useContext } from 'react';

import classes from '../../sass/components/Leaderboard/LeaderboardProfil.module.scss';
import ProfilIcon from '../Profile/ProfilIcon';
import { UserAPI, UserContext } from '../../store/users-contexte';

const LeaderboardProfil: React.FC<{user: UserAPI}> = ( { user }) => {
	

	const userCtx = useContext(UserContext);

	const fetchAddFriend = async () => {
		const friendId = {
			friendId: user.id
		};
		const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/add-friend', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(friendId)
		});
		if (!response.ok)
			return ;
		userCtx.fetchUser();
	};

	const removeFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		userCtx.fetchRemoveFriend(user);
	}

	const addFriendHandler = (event: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
		fetchAddFriend();
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

	return (
		<div className={classes.container}>
			<ProfilIcon user={user}/>
			<p>{user.name}</p>
			<div className={classes.icon}>
				<i className='fa-solid fa-trophy'>: {user.wins}</i>
				<i 
					className='fa-solid fa-message'
					style={ isSelf() ? {color: 'gray'} : {}} 
				></i>
				{ friendIconDisplay() }
				<i 
					className='fa-solid fa-table-tennis-paddle-ball'
					style={ isSelf() ? {color: 'gray'} : {}} 
				></i>
			</div>
		</div>
	)
}

export default LeaderboardProfil;
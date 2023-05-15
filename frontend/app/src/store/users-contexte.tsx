import React, { useEffect, useState } from 'react';

import OliviaPic from '../assets/images/owalsh.jpg';
import FanyPic from '../assets/images/foctavia.jpg';
import YangPic from '../assets/images/ykuo.jpg';
import SimonPic from '../assets/images/profile-pic.jpg';
import Dummy1Pic from '../assets/images/Dog_Breeds.jpg';
import Dummy2Pic from '../assets/images/corgi.jpeg';

export type UserMatch = {
	opponent: User,
	playerScore: number,
	opponentScore: number
}

// export type User = {
// 	login: string,
// 	nickname: string,
// 	password: string,
// 	wins: number,
// 	lose: number,
// 	profilePic: string,
// 	friends: User[],
// 	block: User[],
// 	matchs: UserMatch[],
// 	connected: boolean,
// 	doubleAuth: boolean,
// }

export type User = {
	id: number;
	email: string;
	name: string;
	avatar: string;
	doubleAuth: boolean;
	wins: number;
	gamesPlayed: number;
	friends: User[],
	block: User[],
	matchs: UserMatch[],
	connected: boolean,
  };

export type UserFunction = (user: User) => void;

const oliviaUser: User = {
		login: 'OWalsh',
		nickname: 'Oliv',
		password: 'simon',
		wins: 2,
		lose: 3,
		profilePic: OliviaPic,
		friends: [],
		block: [],
		matchs: [],
		connected: true,
		doubleAuth: false
}

const fanyUser: User = {
	login: 'FOctavia',
	password: 'simon',
	nickname: 'Faaaaany',
	wins: 0,
	lose: 2,
	profilePic: FanyPic,
	friends: [],
	block: [],
	matchs: [],
	connected: false,
	doubleAuth: false

}

const ychiUser: User = {
	login: 'Ykuo',
	password: 'simon',
	nickname: 'Yang',
	wins: 2,
	lose: 0,
	profilePic: YangPic,
	friends: [],
	block: [],
	matchs: [],
	connected: false,
	doubleAuth: false
}

const dummy1: User = {
	login: 'Dummy',
	password: 'simon',
	nickname: 'Dum1',
	wins: 0,
	lose: 99,
	profilePic: Dummy1Pic,
	friends: [],
	block: [],
	matchs: [],
	connected: false,
	doubleAuth: false
}

const match3: UserMatch = {
	opponent: dummy1,
	playerScore: 99,
	opponentScore: 0
}

const dummy2: User = {
	login: 'Corgi',
	password: 'simon',
	nickname: 'Corg',
	wins: 99,
	lose: 0,
	profilePic: Dummy2Pic,
	friends: [],
	block: [],
	matchs: [match3],
	connected: false,
	doubleAuth: false
}

const match1: UserMatch = {
	opponent: fanyUser,
	playerScore: 2,
	opponentScore: 4
}

const match2: UserMatch = {
	opponent: oliviaUser,
	playerScore: 1,
	opponentScore: 4
}

const simonUser: User = {
	id: 2,
	name: 'simon',
	email: 'sbeylot@student.42.fr',
	avatar: 'sbeylot.jpg',
	wins: 3,
	gamesPlayed: 5,
	friends: [oliviaUser, fanyUser, ychiUser],
	block: [],
	matchs: [match1, match2],
	connected: true,
	doubleAuth: false
}

const userList: User[] = [
	simonUser,
	fanyUser,
	oliviaUser,
	ychiUser,
	dummy1,
	dummy2
]

export const UserContext = React.createContext<{
		user: User;
		userList: User[];
		blockUser: (user: User) => void;
		unblockUser: (user: User) => void;
		friendUser: (user: User) => void; 
		unfriendUser: (user: User) => void;
		changeNickname: (newNickname: string) => void;
		updateImage: (newImage: string) => void;
	}>({
	user: simonUser,
	userList: userList,
	blockUser: (user: User) => {},
	unblockUser: (user: User) => {},
	friendUser: (user: User) => {},
	unfriendUser: (user: User) => {},
	changeNickname: (newNickname: string) => {},
	updateImage: (newImage: string) => {}
});

type Props = {
	children?: React.ReactNode,
	className?: string
};
	
	const UsersContextProvider: React.FC<Props> = ( {children, className} ) => {
		
		const [user, setUser] = useState<User>(simonUser);
		const [userList, setUserList] = useState<User[]>([]);

		useEffect(() => {
			fetch('http://localhost:3000/users')
			.then(response => response.json())
			.then(data => {
				setUserList(data);
				// if (data.length > 0) {
				// 	setUser(data[0]); // set the first user as the current user
				// }
				console.log('user ', user);
				console.log('userList ', data);
				console.log('data[0] ', data[0]);
				setUser(data[0]);
				console.log('set user as first user in list: ', user);
			})
			// .then(data => console.log(data));
			// .catch(error => console.error('Error:', error));
		}, []);
		

	const addBlockUser = (userToBlock: User) => {
		setUser(prevState => ({
			...prevState, 
			block: [...prevState.block.includes(userToBlock) ? prevState.block : [...prevState.block, userToBlock]]
		}));
	};

	// const addBlockUser = (userToBlock: User) => {
	// 	fetch(`http://localhost:3000/users/${user.id}/block-user`, {
	// 		method: 'PATCH',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ blockedId: userToBlock.id }),
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setUser(prevState => ({
	// 			...prevState, 
	// 			block: [...prevState.block.includes(userToBlock) ? prevState.block : [...prevState.block, userToBlock]]
	// 		}));
	// 	})
	// 	.catch(error => console.error('Error:', error));
	// };

	const removeBlockUser = (userToUnblock: User) => {
		setUser(prevState => ({
			...prevState,
			block: prevState.block.filter(friend => friend.name !== userToUnblock.name)
		}));
	};

	const removeFriendUser = (userToUnfriend: User) => {
		if (userToUnfriend === user)
		return ;

		setUser(prevState => ({
			...prevState,
			friends: prevState.friends.filter(friend => friend.name !== userToUnfriend.name)
		}));
	};

	// const addFriendUser = (userToFriend: User) => {
	// 	if (userToFriend === user)
	// 		return ;
	// 	setUser(prevState => ({
	// 		...prevState,
	// 		friends: [...prevState.friends, userToFriend]
	// 	}))
	// }

	const addFriendUser = (newFriend: User) => {
		fetch(`http://localhost:3000/users/${user.id}/add-friend`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ friendId: newFriend.id }),
		})
		.then(response => response.json())
		.then(data => {
			setUser(prevState => ({
				...prevState, 
				block: [...prevState.block.includes(newFriend) ? prevState.block : [...prevState.block, newFriend]]
			}));
		})
		.catch(error => console.error('Error:', error));
	};

	const changeNickname = (newNickname: string) => {
		setUser(prevState => ({
			...prevState,
			nickname: newNickname
		}));
	};

	const changeProfilPicture = (newImage: string) => {
		setUser(prevState => ({
			...prevState,
			profilePic: newImage
		}));
	};

	const contextValue = {
		user: user,
		userList: userList,
		blockUser: addBlockUser,
		unblockUser: removeBlockUser,
		friendUser: addFriendUser,
		unfriendUser: removeFriendUser,
		changeNickname: changeNickname,
		updateImage: changeProfilPicture
	};

	return (
		<div className={className}>
			<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
		</div>
	);
};

export default UsersContextProvider;
import React, { useCallback, useEffect, useState } from 'react';

import OliviaPic from '../assets/images/owalsh.jpg';
import FanyPic from '../assets/images/foctavia.jpg';
import YangPic from '../assets/images/ykuo.jpg';
import SimonPic from '../assets/images/profile-pic.jpg';
import Dummy1Pic from '../assets/images/Dog_Breeds.jpg';
import Dummy2Pic from '../assets/images/corgi.jpeg';
import { async } from 'q';

export type UserMatch = {
	opponent: User,
	playerScore: number,
	opponentScore: number
}

export type User = {
	login: string,
	nickname: string,
	password: string,
	wins: number,
	lose: number,
	profilePic: string,
	friends: User[],
	block: User[],
	matchs: UserMatch[],
	connected: boolean,
	doubleAuth: boolean,
}

export type UserAPI = {
	id: number;
	email: string;
	name: string;
	avatar: string;
	doubleAuth: boolean;
	wins: number;
	gamesPlayed: number;
	friends: UserAPI[],
	block: UserAPI[],
	matchs: UserMatch[],
	connected: boolean,
  };

export type UserFunction = (user: User) => void;

// const oliviaUser: User = {
// 		login: 'OWalsh',
// 		nickname: 'Oliv',
// 		password: 'simon',
// 		wins: 2,
// 		lose: 3,
// 		profilePic: OliviaPic,
// 		friends: [],
// 		block: [],
// 		matchs: [],
// 		connected: true,
// 		doubleAuth: false
// }

// const fanyUser: User = {
// 	login: 'FOctavia',
// 	password: 'simon',
// 	nickname: 'Faaaaany',
// 	wins: 0,
// 	lose: 2,
// 	profilePic: FanyPic,
// 	friends: [],
// 	block: [],
// 	matchs: [],
// 	connected: false,
// 	doubleAuth: false

// }

// const ychiUser: User = {
// 	login: 'Ykuo',
// 	password: 'simon',
// 	nickname: 'Yang',
// 	wins: 2,
// 	lose: 0,
// 	profilePic: YangPic,
// 	friends: [],
// 	block: [],
// 	matchs: [],
// 	connected: false,
// 	doubleAuth: false
// }

// const dummy1: User = {
// 	login: 'Dummy',
// 	password: 'simon',
// 	nickname: 'Dum1',
// 	wins: 0,
// 	lose: 99,
// 	profilePic: Dummy1Pic,
// 	friends: [],
// 	block: [],
// 	matchs: [],
// 	connected: false,
// 	doubleAuth: false
// }

// const match3: UserMatch = {
// 	opponent: dummy1,
// 	playerScore: 99,
// 	opponentScore: 0
// }

// const dummy2: User = {
// 	login: 'Corgi',
// 	password: 'simon',
// 	nickname: 'Corg',
// 	wins: 99,
// 	lose: 0,
// 	profilePic: Dummy2Pic,
// 	friends: [],
// 	block: [],
// 	matchs: [match3],
// 	connected: false,
// 	doubleAuth: false
// }

// const match1: UserMatch = {
// 	opponent: fanyUser,
// 	playerScore: 2,
// 	opponentScore: 4
// }

// const match2: UserMatch = {
// 	opponent: oliviaUser,
// 	playerScore: 1,
// 	opponentScore: 4
// }

const simonUser: User = {
	id: 1,
	name: 'simon',
	email: 'sbeylot@student.42.fr',
	avatar: 'sbeylot.jpg',
	wins: 3,
	gamesPlayed: 5,
	friends: [],
	block: [],
	matchs: [],
	connected: true,
	doubleAuth: false
}

const userList: User[] = [
	simonUser,
	// fanyUser,
	// oliviaUser,
	// ychiUser,
	// dummy1,
	// dummy2
]

export const UserContext = React.createContext<{
		user: UserAPI | null;
		// userList: User[];
		// blockUser: (user: User) => void;
		// unblockUser: (user: User) => void;
		// friendUser: (user: User) => void; 
		// unfriendUser: (user: User) => void;
		// changeNickname: (newNickname: string) => void;
		// updateImage: (newImage: string) => void;
	}>({
	user: null,
	// userList: userList,
	// blockUser: (user: User) => {},
	// unblockUser: (user: User) => {},
	// friendUser: (user: User) => {},
	// unfriendUser: (user: User) => {},
	// changeNickname: (newNickname: string) => {},
	// updateImage: (newImage: string) => {}
});

type Props = {
	children?: React.ReactNode,
	className?: string
};
	
	const UsersContextProvider: React.FC<Props> = ( {children, className} ) => {
		
		const [user, setUser] = useState<UserAPI | null>(null);
		const [ error, setError ] = useState<string | null>(null);

		console.log(user);

		const fetchUser = useCallback(async () => {
			setError(null);
			try {
				const response = await fetch('http://localhost:3000/users/1');
				const data = await response.json();

				if (!response.ok)
					throw new Error('Failed to fetch User');

				const dataUser: UserAPI = {
					id: data.id,
					name: data.name,
					avatar: data.avatar,
					email: data.email,
					doubleAuth: data.doubleAuth,
					wins: data.wins,
					gamesPlayed: 0,
					friends: [],
					block: [],
					matchs: [],
					connected: true
				}
				setUser(dataUser);
			}
			catch ( error: any ) {
				setError(error.message);
			}
		}, []);

		const fetchUserFriends = useCallback(async () => {
			setError(null);

			const response = await fetch('http://localhost:3000/users/1/show-friends');
			const data = await response.json();

			console.log("Friends List: ", data);
			return data;
		}, []);

		useEffect(() => {
			fetchUser();
			fetchUserFriends();
		}, [fetchUser, fetchUserFriends]);


		// const [userList, setUserList] = useState<User[]>([]);

		// useEffect(() => {
		
		// 	fetch('http://localhost:3000/users')
		// 	.then(response => response.json())
		// 	.then(data => setUserList(data));
		// 	// .then(data => console.log(data));
		// 	// .catch(error => console.error('Error:', error));
		// }, []);
	
	// 	const addBlockUser = (userToBlock: User) => {
	// 		setUser(prevState => ({
	// 			...prevState, 
	// 			block: [...prevState.block.includes(userToBlock) ? prevState.block : [...prevState.block, userToBlock]]
	// 		}));
	// 	};

	// 	const removeBlockUser = (userToUnblock: User) => {
	// 		setUser(prevState => ({
	// 			...prevState,
	// 			block: prevState.block.filter(friend => friend.nickname !== userToUnblock.nickname)
	// 		}));
	// 	};

	// 	const removeFriendUser = (userToUnfriend: User) => {
	// 		if (userToUnfriend === user)
	// 		return ;

	// 		setUser(prevState => ({
	// 			...prevState,
	// 			friends: prevState.friends.filter(friend => friend.nickname !== userToUnfriend.nickname)
	// 		}));
	// 	};

	// 	const addFriendUser = (userToFriend: User) => {
	// 		if (userToFriend === user)
	// 			return ;
	// 		setUser(prevState => ({
	// 			...prevState,
	// 			friends: [...prevState.friends, userToFriend]
	// 		}))
	// 	}

	// 	const changeNickname = (newNickname: string) => {
	// 		setUser(prevState => ({
	// 			...prevState,
	// 			nickname: newNickname
	// 		}));
	// 	};

	// 	const changeProfilPicture = (newImage: string) => {
	// 		setUser(prevState => ({
	// 			...prevState,
	// 			profilePic: newImage
	// 	}));
	// };

	const contextValue = {
		user: user,
		// userList: userList,
		// blockUser: addBlockUser,
		// unblockUser: removeBlockUser,
		// friendUser: addFriendUser,
		// unfriendUser: removeFriendUser,
		// changeNickname: changeNickname,
		// updateImage: changeProfilPicture
	};

	return (
		<div className={className}>
			<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
		</div>
	);
};

export default UsersContextProvider;
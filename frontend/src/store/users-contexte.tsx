import React, { useState } from 'react';

export type User = {
	login: string,
	nickname: string,
	wins: number,
	lose: number,
	profilePic: string,
	friends: User[],
	block: User[],
}

const oliviaUser: User = {
		login: 'OWalsh',
		nickname: 'Oliv',
		wins: 2,
		lose: 3,
		profilePic: '../../assets/images/owalsh.jpg',
		friends: [],
		block: []
}

const fanyUser: User = {
	login: 'FOctavia',
	nickname: 'Faaaaany',
	wins: 0,
	lose: 2,
	profilePic: '../../assets/foctavia.jpg',
	friends: [],
	block: []
}

const ychiUser: User = {
	login: 'Ykuo',
	nickname: 'Yang',
	wins: 2,
	lose: 0,
	profilePic: '../../assets/ykuo.jpg',
	friends: [],
	block: []
}

const simonUser: User = {
	login: 'Sbeylot',
	nickname: 'SimSim',
	wins: 3,
	lose: 2,
	profilePic: '../../assets/profile-pic.jpg',
	friends: [oliviaUser, fanyUser, ychiUser],
	block: []
}

export const UserContext = React.createContext<{user: User}>({
	user: simonUser
});

type Props = {
	children?: React.ReactNode
};


const UsersContextProvider: React.FC<Props> = ( {children} ) => {


	const contextValue = {
		user: simonUser
	}

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UsersContextProvider;
import { UserAPI } from "../store/users-contexte";

export const winsSortedUser = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => n2.wins - n1.wins);
};
export const loosesSortedUser = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => n1.wins - n2.wins);
};

export const alphaOrderNick = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => {
		if (n1.name > n2.name)
			return 1;
		if (n1.name < n2.name) 
			return -1;
		return 0;
	});
};

export const unAlphaOrderNick = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => {
		if (n1.name > n2.name)
			return -1;
		if (n1.name < n2.name)
			return 1;
		return 0;
	});
};

export const mostPlayedGame = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => (n2.wins) - (n1.wins));
};
export const lessPlayedGame = (userList: UserAPI[]) => {
	return [...userList].sort((n1, n2) => (n1.wins) - (n2.wins));
};
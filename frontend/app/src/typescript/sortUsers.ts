import { User } from "../store/users-contexte";

export const winsSortedUser = (userList: User[]) => {
	return [...userList].sort((n1, n2) => n2.wins - n1.wins);
};
export const loosesSortedUser = (userList: User[]) => {
	return [...userList].sort((n1, n2) => n1.wins - n2.wins);
};

export const alphaOrderNick = (userList: User[]) => {
	return [...userList].sort((n1, n2) => {
		if (n1.nickname > n2.nickname)
			return 1;
		if (n1.nickname < n2.nickname) 
			return -1;
		return 0;
	});
};

export const unAlphaOrderNick = (userList: User[]) => {
	return [...userList].sort((n1, n2) => {
		if (n1.nickname > n2.nickname)
			return -1;
		if (n1.nickname < n2.nickname)
			return 1;
		return 0;
	});
};

export const mostPlayedGame = (userList: User[]) => {
	return [...userList].sort((n1, n2) => (n2.wins + n2.lose) - (n1.wins + n1.lose));
};
export const lessPlayedGame = (userList: User[]) => {
	return [...userList].sort((n1, n2) => (n1.wins + n1.lose) - (n2.wins + n2.lose));
};
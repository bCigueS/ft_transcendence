import React, { useCallback, useEffect, useState } from 'react';

export type UserMatch = {
	user?: UserAPI,
	opponent?: UserAPI,
	playerScore: number,
	opponentScore: number
}

export type UserLiveGames = {
	player?: UserAPI;
	opponent?: UserAPI;
	gameRoom: string;
}

export type UserAPI = {
	id: number;
	email: string;
	name: string;
	avatar: string;
	doubleAuth: boolean;
	wins: number;
	gamesPlayed?: number;
	friends?: UserAPI[],
	block?: UserAPI[],
	matchs?: UserMatch[],
	connected?: boolean,
  };

export const UserContext = React.createContext<{
		user: UserAPI | null;
		error: string | null;
		token?: string;
		saveToken: (token: string, userIdInput: number) => void,
		saveToken2: (token: string) => void,
		deleteToken: () => void,
		fetchUserFriends: (id: number) => void;
		fetchUserBlockings: (id: number) => void;
		fetchUser: () => void;
		fetchAddFriend: (otherUser: UserAPI) => void;
		fetchRemoveFriend: (targetUser: UserAPI) => void;
		fetchBlockUser: (targetUser: UserAPI) => void;
		fetchUnblockUser: (targetUser: UserAPI) => void;
		fetchUserById: (userId: number) => void;
		isSelf: (otherUser: UserAPI) => boolean;
		isFriend: (otherUser: UserAPI) => boolean;
	}>({
	user: null,
	error: null,
	token: undefined,
	saveToken: (token: string, userIdInput: number) => {},
	saveToken2: (token: string) => {},
	deleteToken: () => {},
	fetchUserFriends: (id: number) => {},
	fetchUserBlockings: (id: number) => {},
	fetchUser: () => {},
	fetchAddFriend: (otherUser: UserAPI) => {},
	fetchRemoveFriend: (targetUser: UserAPI) => {},
	fetchBlockUser: (targetUser: UserAPI) => {},
	fetchUnblockUser: (targetUser: UserAPI) => {},
	fetchUserById: (userId: number) => {},
	isSelf: (otherUser: UserAPI) => false,
	isFriend: (otherUser: UserAPI) => false,
	});

type Props = {
	children?: React.ReactNode,
	className?: string
};
	
	const UsersContextProvider: React.FC<Props> = ( {children, className} ) => {
		
		const [ user, setUser ] = useState<UserAPI | null>(null);
		const [ userId, setUserId ] = useState<number>(1);
		const [ token, setToken ] = useState<string | undefined>(undefined);
		const [ loading, setLoading ] = useState<boolean>(true);
		const [ error, setError ] = useState<string | null>(null);
		const [ gamesPlayed, setGamesPlayed ] = useState(0);


		const saveToken = (token: string,  userIdInput: number) => {
			setUserId(userIdInput);
			setToken(token);
		}

		const saveToken2 = (token: string) => {
			setToken(token);
		}

		const deleteToken = () => {
			setUserId(1);
			setToken(undefined);
		}

		const fetchRemoveFriend = async (targetUser: UserAPI) => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId

			const friendId = {
				friendId: targetUser.id
			};
			try {
				const response = await fetch('http://localhost:3000/users/' + idToFetch + '/remove-friend', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(friendId)
				});

				if (!response.ok) {
					throw new Error('fetchRemoveFriend Failed');
				}
				fetchUser();
			} catch (error: any) {
				setError(error.message);
			}
		}

		const fetchBlockUser = async (targetUser: UserAPI) => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId

			const blockedId = {
				blockedId: targetUser.id
			};
			try {
				const response = await fetch('http://localhost:3000/users/' + idToFetch + '/block-user', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(blockedId)
				});

				if (response.status === 400)
					throw new Error("Failed to add block, user already block");
				if (!response.ok) {
					throw new Error("Failed to fetch block User");
				}
				fetchUser();
			} catch (error: any) {
				setError(error.message);
			}
		}

		const fetchUnblockUser = async (targetUser: UserAPI) => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId

			const blockedId = {
				blockedId: targetUser.id
			};
			try {

				const response = await fetch('http://localhost:3000/users/' + idToFetch + '/unblock-user', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(blockedId)
				});

				if (!response.ok) {
					throw new Error('Failed to fetch Unblock user');
				}
				fetchUser();
			} catch (error: any) {
				setError(error.message);
			}
		}

		const fetchUserById = useCallback(async (userId: number) => {
			setError(null);

			let userFound: UserAPI | null = null;

			try {
				const response = await fetch('http://localhost:3000/users/' + userId);
				const data = await response.json();

				if (!response.ok)
					throw new Error('Failed to fetch user with id ' + userId);
				
				userFound = {
					id: data.id,
					email: data.email,
					name: data.name,
					avatar: data.avatar,
					doubleAuth: data.doubleAuth,
					wins: data.wins
				}
			}
			catch (error: any) {
				setError( error.message );
			}
			return userFound;
			
		}, [])

		const fetchUserFriends = useCallback(async (id: number) => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId

			let userFriends: UserAPI[] = [];

			try {
				const response = await fetch('http://localhost:3000/users/'+ idToFetch + '/show-friends');
				const data = await response.json();

				if (!response.ok)
					throw new Error('Failed to fetch Users List')
	
				userFriends = data.map((user: any) => {
					return {
						id: user.id,
						email: user.email,
						name: user.name,
						avatar: user.avatar,
						doubleAuth: user.doubleAuth,
						wins: user.wins
					}
				});
			} catch (error: any) {
				setError( error.message);
			}
			return userFriends;
		}, [userId]);

		const fetchUserBlockings = useCallback(async (id: number) => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId
			let userBlockings: UserAPI[] = [];

			try {
				const response = await fetch('http://localhost:3000/users/' + idToFetch + '/show-blocked-users');
				const data = await response.json();

				if (!response.ok)
					throw new Error('Failed to fetch Users List')
	
				userBlockings = data.map((user: any) => {
					return {
						id: user.id,
						email: user.email,
						name: user.name,
						avatar: user.avatar,
						doubleAuth: user.doubleAuth,
						wins: user.wins
					}
				});
			} catch (error: any) {
				setError( error.message);
			}
			return userBlockings;
		}, [userId]);

		const isFriend = (otherUser: UserAPI) => {
			return user?.friends?.some(friend => otherUser.id === friend.id) || false;
		}

		const isSelf = (otherUser: UserAPI) => {
			return user?.id === otherUser.id;
		}

		const fetchAddFriend = async(otherUser: UserAPI) => {
			setError(null);
			const friendId = {
				friendId: otherUser.id
			};

			try {
				const response = await fetch('http://localhost:3000/users/' + user?.id + '/add-friend', {
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
					throw new Error("Failed to add friend!");

				fetchUser();
			} catch (error: any) {
				setError(error.message);
			}
		};

		const fetchUser = useCallback(async () => {
			setError(null);
			const storedUserId = localStorage.getItem('userId');
			const idToFetch = storedUserId ? Number(storedUserId) : userId
			try {
				const response = await fetch('http://localhost:3000/users/' + idToFetch);
				const data = await response.json();
			
				if (!response.ok)
				throw new Error('Failed to fetch User');

				const userFriends = await fetchUserFriends(data.id);
				const userBlockings = await fetchUserBlockings(data.id);
		  
				const dataUser: UserAPI = {
				id: data.id,
				name: data.name,
				avatar: data.avatar,
				email: data.email,
				doubleAuth: data.doubleAuth,
				wins: data.wins,
				gamesPlayed: 0,
				friends: userFriends,
				block: userBlockings,
				matchs: [],
				connected: true
				}
				setUser(dataUser);
			}
			catch ( error: any ) {
				setError(error.message);
			} 
			finally {
				setLoading(false);
			}
		  }, [fetchUserFriends, fetchUserBlockings, userId]);
		  
		useEffect(() => {
			fetchUser();
		  }, [fetchUser, setUserId, userId, user?.name]);


		if (loading) {
			return <div>Loading...</div>
		}

	const contextValue = {
		user: user,
		error: error,
		token: undefined,
		saveToken: saveToken,
		saveToken2: saveToken2,
		deleteToken: deleteToken,
		fetchUserFriends: fetchUserFriends,
		fetchUserBlockings: fetchUserBlockings,
		fetchUser: fetchUser,
		fetchAddFriend: fetchAddFriend,
		fetchRemoveFriend: fetchRemoveFriend,
		fetchBlockUser: fetchBlockUser,
		fetchUnblockUser: fetchUnblockUser,
		fetchUserById: fetchUserById,
		isSelf: isSelf,
		isFriend: isFriend,
	};

	return (
		<div className={className}>
			<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
		</div>
	);
};

export default UsersContextProvider;
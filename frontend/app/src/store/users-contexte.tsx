import React, { useCallback, useEffect, useState } from 'react';

export type UserMatch = {
	opponent: UserAPI,
	playerScore: number,
	opponentScore: number
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

export const UserContext = React.createContext<{
		user: UserAPI | null;
		error: string | null;
		token?: string;
		saveToken: (token: string, userIdInput: number) => void,
		deleteToken: () => void,
		fetchUserFriends: (id: number) => void;
		fetchUserBlockings: (id: number) => void;
		fetchUser: () => void;
		fetchRemoveFriend: (targetUser: UserAPI) => void;
		fetchBlockUser: (targetUser: UserAPI) => void;
		fetchUnblockUser: (targetUser: UserAPI) => void;
	}>({
	user: null,
	error: null,
	token: undefined,
	saveToken: (token: string, userIdInput: number) => {},
	deleteToken: () => {},
	fetchUserFriends: (id: number) => {},
	fetchUserBlockings: (id: number) => {},
	fetchUser: () => {},
	fetchRemoveFriend: (targetUser: UserAPI) => {},
	fetchBlockUser: (targetUser: UserAPI) => {},
	fetchUnblockUser: (targetUser: UserAPI) => {}
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

		const saveToken = (token: string,  userIdInput: number) => {
			setUserId(userIdInput);
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
		}, []);

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
		}, []);

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
			console.log("User Context, User is: ", user?.name);
			console.log("User id is: ", userId);

		  }, [fetchUser, userId, user?.name]);


		if (loading) {
			return <div>Loading...</div>
		}

	const contextValue = {
		user: user,
		error: error,
		token: undefined,
		saveToken: saveToken,
		deleteToken: deleteToken,
		fetchUserFriends: fetchUserFriends,
		fetchUserBlockings: fetchUserBlockings,
		fetchUser: fetchUser,
		fetchRemoveFriend: fetchRemoveFriend,
		fetchBlockUser: fetchBlockUser,
		fetchUnblockUser: fetchUnblockUser
	};

	return (
		<div className={className}>
			<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
		</div>
	);
};

export default UsersContextProvider;
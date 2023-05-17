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
		fetchUserFriends: (id: number) => void;
		fetchUser: () => void;
		fetchDeleteUser: (targetUser: UserAPI) => void;
	}>({
	user: null,
	fetchUserFriends: (id: number) => {},
	fetchUser: () => {},
	fetchDeleteUser: (targetUser: UserAPI) => {}
	});

type Props = {
	children?: React.ReactNode,
	className?: string
};
	
	const UsersContextProvider: React.FC<Props> = ( {children, className} ) => {
		
		const [user, setUser] = useState<UserAPI | null>(null);
		const [ loading, setLoading ] = useState<boolean>(true);
		const [ error, setError ] = useState<string | null>(null);


		const fetchDeleteUser = async (targetUser: UserAPI) => {
			const friendId = {
				friendId: targetUser.id
			};
			const response = await fetch('http://localhost:3000/users/' + user?.id + '/remove-friend', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(friendId)
			});
			fetchUser();
		}

		const fetchUserFriends = useCallback(async (id: number) => {
			setError(null);

			let userFriends: UserAPI[] = [];

			try {
				const response = await fetch('http://localhost:3000/users/1/show-friends');
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

		const fetchUser = useCallback(async () => {
			setError(null);
			try {
				const response = await fetch('http://localhost:3000/users/1');
				const data = await response.json();
			
				if (!response.ok)
				throw new Error('Failed to fetch User');

				const userFriends = await fetchUserFriends(data.id);
		  
				const dataUser: UserAPI = {
				id: data.id,
				name: data.name,
				avatar: data.avatar,
				email: data.email,
				doubleAuth: data.doubleAuth,
				wins: data.wins,
				gamesPlayed: 0,
				friends: userFriends,
				block: [],
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
		  }, [fetchUserFriends]);
		  
		useEffect(() => {
			fetchUser();
		  }, [fetchUser]);
	

		if (loading) {
			return <div>Loading...</div>
		}

	const contextValue = {
		user: user,
		fetchUserFriends: fetchUserFriends,
		fetchUser: fetchUser,
		fetchDeleteUser: fetchDeleteUser
	};

	return (
		<div className={className}>
			<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
		</div>
	);
};

export default UsersContextProvider;
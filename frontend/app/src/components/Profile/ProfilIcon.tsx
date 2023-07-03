import React, { useCallback, useEffect, useState, useContext } from 'react';
import { UserAPI, UserContext } from '../../store/users-contexte';
import { NavigateOptions, useNavigate } from 'react-router-dom';
import DefaultImage from '../../assets/images/default.jpg';
import classes from '../../sass/components/Profile/ProfilIcon.module.scss';

const ProfilIcon: React.FC<{
	user?: UserAPI | null;
	displayCo?: boolean;
	size?: string[];
	border?: boolean;
	superUser?: boolean
}> = ( { user, displayCo = true, size = [], border = false, superUser = false}) => {
	
	const [ imageUrl, setImageUrl ] = useState<string>('');
	const [ loading , setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | null>(null);
	// const [ inGame, setInGame ] = useState<boolean>(false);
	const navigate = useNavigate();
	const userCtx = useContext(UserContext);

	const stylePicture: React.CSSProperties = {
		content: '',
		position: 'absolute',
		inset: '-0.7rem',
		background: 'linear-gradient(90deg, rgba(245,173,167,1) 0%, rgba(241,93,81,1) 35%, rgba(235,137,71,1) 100%)',
		borderRadius: '50%'
	};

	const navHandler = () => {
		const option: NavigateOptions = {
			replace: false,
			state: { message: "Failed to submit form!"}
		}

		navigate(`/profile/${user?.id}`, option);
	}

	const fetchAvatar = useCallback(async() => {
		setLoading(true);
		setError(null);
		if (user?.id === undefined)
			return ;
		try {
			const response = await fetch('http://localhost:3000/users/' + user?.id + '/avatar', {
				method: 'GET',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				}
			});
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);

				setImageUrl(url);
				setLoading(false);
			} else {
				throw new Error("Error in fetching avatar!");				
			}
		} catch (error: any) {
			setError(error.message);
			setLoading(false);
		}
	}, [user?.id, userCtx.logInfo?.token]);

	useEffect(() => {
		fetchAvatar();
	}, [fetchAvatar, error]);

	return (
		<div 
			className={classes.profilPic}
			onClick={navHandler} 
			style={size.length > 0 ? {width: size[0], height: size[1]} : {}}>
			
			{ border &&
				<div style={stylePicture}></div>
			}
			<div 
				className={classes.picture}
				style={size.length > 0 ? {width: size[0], height: size[1] } : {}}>
					{ superUser &&
						<i className={`fa-solid fa-crown ${classes.crownIcon}`}></i>
						// <i className="fa-thin fa-crown"></i>
						// <div>crown here</div>
					}
				<img 
					src={!loading ? imageUrl : DefaultImage} 
					alt={user?.name} 
				/>
			</div>
			{
				displayCo &&
				<i 
					// className={!inGame ? "fa-solid fa-circle" : "fa-solid fa-table-tennis-paddle-ball"} 
					className="fa-solid fa-circle"
					style={{color: user?.connected ? 'green' : 'red' }
					}>
				</i>
			}
		</div>
	)
}

export default ProfilIcon;
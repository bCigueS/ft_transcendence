import React, { useCallback, useEffect, useState } from 'react';
import { UserAPI } from '../../store/users-contexte';
import { NavigateOptions, useNavigate } from 'react-router-dom';
import classes from '../../sass/components/Profile/ProfilIcon.module.scss';



const ProfilIcon: React.FC<{user?: UserAPI | null; displayCo?: boolean; size?: string[]}> = ( { user, displayCo = true, size = []}) => {
	
	const [ imageUrl, setImageUrl ] = useState<string>('');
	const [ loading , setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | null>(null);
	const navigate = useNavigate();

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

		navigate(`/profile/${user?.name.toLowerCase()}`, option);
	}

	const fetchAvatar = useCallback(async() => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('http://localhost:3000/users/' + user?.id + '/avatar');
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
	}, [user?.id]);

	useEffect(() => {
		fetchAvatar();
	}, [fetchAvatar]);

	return (
		<div 
			className={classes.profilPic}
			onClick={navHandler} 
			style={size.length > 0 ? {width: size[0], height: size[1]} : {}}>
			
			{ size.length > 0 &&
				<div style={stylePicture}></div>
			}
			<div 
				className={classes.picture}
				style={size.length > 0 ? {width: size[0], height: size[1] } : {}}>
				<img 
					src={!loading ? imageUrl : ''} 
					alt={user?.name} 
				/>
			</div>
			{
				displayCo &&
				<i 
					className="fa-solid fa-circle" 
					style={{color: user?.connected ? 'green' : 'red' }
					}>
				</i>
			}
		</div>
	)
}

export default ProfilIcon;
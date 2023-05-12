import React from 'react';
import { User } from '../../store/users-contexte';
import { NavigateOptions, useNavigate } from 'react-router-dom';
import classes from '../../sass/components/Profile/ProfilIcon.module.scss';



const ProfilIcon: React.FC<{user?: User; displayCo?: boolean; size?: string[]}> = ( { user, displayCo = true, size = []}) => {

	const navigate = useNavigate();

	const stylePicture: React.CSSProperties = {
		content: '',
		position: 'absolute',
		inset: '-0.7rem',
		background: 'linear-gradient(90deg, rgba(245,173,167,1) 0%, rgba(241,93,81,1) 35%, rgba(235,137,71,1) 100%)',
		borderRadius: '50%'
	};

	const navHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const option: NavigateOptions = {
			replace: false,
			state: { message: "Failed to submit form!"}
		}
		navigate(`/profile/${user?.name.toLowerCase()}`, option);
	}


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
					src={'http://localhost:3000/users/' + user?.id + '/avatar'} 
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
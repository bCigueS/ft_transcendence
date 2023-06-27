import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Form, Link } from "react-router-dom";
import { UserContext } from "../../store/users-contexte";
// import { UserContext } from "../../store/users-contexte";

interface menuOption {
	icon1: string,
	icon2: string,
	text: string,
	link: string
}

const ProfilMenu: React.FC = () => {
	const userCtx = useContext(UserContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState<string>('')
	const menuRef = useRef<HTMLDivElement>(null);

	const logoutHandler = () => {
		userCtx.deleteToken();
	}

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}

		window.addEventListener('mousedown', handleOutsideClick);
		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [menuRef]);

	const menuOptions: menuOption[] = [
		{icon1: 'fa-solid fa-user', icon2: 'fa-solid fa-chevron-right', text: 'Profile', link: '/profile/' + userCtx.user?.id},
		{icon1: 'fa-solid fa-message', icon2: 'fa-solid fa-chevron-right', text: 'Message', link: '/chat'},
	]

	const fetchAvatar = useCallback( async() => {
		if (userCtx.user?.id === undefined)
			return ;
		try {
			const response = await fetch('http://localhost:3000/users/' + userCtx.user?.id + '/avatar', {
				method: 'GET',
				headers: {
					'Authorization' : 'Bearer ' + userCtx.logInfo?.token,
				}
			});
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);

				setImageUrl(url);

			} else {
				throw new Error("Error in fetching avatar!");				
			}
		} catch (error: any) {
		}
	}, [userCtx.user?.id, userCtx.logInfo?.token]);

	useEffect(() => {
		fetchAvatar();
	}, [fetchAvatar, userCtx.user?.id]);

	return (
		<div className="profile-menu" ref={menuRef}>
			<div
				className="picture"
				onClick={() => setMenuOpen((prev) => !prev)}>
					<img src={imageUrl} alt="" />
			</div>
			{ menuOpen && (
				<div className="profile-menu__items">
					{
						menuOptions.map(items => {
							return (
								<Link key={items.text} className="option" to={items.link} onClick={() => setMenuOpen((prev) => !prev)}>
									<i className={items.icon1}></i>
									<span>{items.text}</span>
									<i className={items.icon2}></i>
								</Link>
							)
						})
					}
					<Form action='/logout' method="post" className="option">
						<i className="fa-solid fa-right-from-bracket"></i>
						<button onClick={logoutHandler}>Logout</button>
						<i className="fa-solid fa-chevron-right"></i>
					</Form>
				</div>
			)}
		</div>
	);
}

export default ProfilMenu;
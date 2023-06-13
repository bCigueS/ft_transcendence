import { useContext, useEffect, useRef, useState } from "react";
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
	const menuRef = useRef<HTMLDivElement>(null);

	const logoutHandler = () => {
		userCtx.deleteToken();
		console.log(userCtx.token);
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

	return (
		<div className="profile-menu" ref={menuRef}>
			<div
				className="profile-menu__picture"
				onClick={() => setMenuOpen((prev) => !prev)}>
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
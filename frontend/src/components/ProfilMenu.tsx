import { useState } from "react";
import { Link } from "react-router-dom";

interface menuOption {
	icon1: string,
	icon2: string,
	text: string,
	link: string
}

export default function ProfilIcon() {
	const [menuOpen, setMenuOpen] = useState(true);

	const menuOptions: menuOption[] = [
		{icon1: 'fa-solid fa-user', icon2: 'fa-solid fa-chevron-right', text: 'Profil', link: ''},
		{icon1: 'fa-solid fa-message', icon2: 'fa-solid fa-chevron-right', text: 'Message', link: ''},
		{icon1: 'fa-solid fa-right-from-bracket', icon2: 'fa-solid fa-chevron-right', text: 'Log out', link: ''}
	]

	return (
		<div className="profil-menu">
			<div
				className="profil-menu__picture"
				onClick={() => setMenuOpen((prev) => !prev)}>
			</div>

			{ menuOpen && (
				<div className="profil-menu__items">

					<div className="header">
						<div className="profil-menu__picture"></div>
						<h1>Profil Name</h1>
					</div>
					{
						menuOptions.map(items => {
							return (
								<Link className="option" to={items.link}>
									<i className={items.icon1}></i>
									<span>{items.text}</span>
									<i className={items.icon2}></i>
								</Link>
							)
						})
					}
				</div>
			)}
		</div>
	);
}
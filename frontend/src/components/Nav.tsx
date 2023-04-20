import { useState } from "react"
import { Link } from "react-router-dom"

import LogoPong from '../assets/logo/pong.svg'
import ProfilPic from '../assets/images/profil-pic.jpg'
import '../sass/main.scss'
import ProfilMenu from "./ProfilMenu"

interface navItem {
	text: string,
	link: string
}

export default function Nav() {

	const navItems: navItem[] = [
		{text: "Home", link:"/"},
		{text: "PingPong", link:"/pong"},
		{text: "Community", link: "/community"},
		{text: "About-us", link: "/about-us"}
	]

	const [menuOpen, setMenuOpen] = useState(false);

	return (
			<nav className="nav">
				{/* Logo */}
				<a href="#">
					<img src={ LogoPong } alt="Logo PingPong" />
				</a>

				{/* Navigation Menu */}
				<ul className='nav-menu'>
					{
						navItems.map(items => {
							return (
								<li className="nav-item">
									<Link to={ items.link } className="nav-link">
										<span className="nav-item_text">{ items.text }</span>
									</Link>
								</li>
							)
						})
					}
				</ul>
				<ProfilMenu />
			</nav>
	);
}
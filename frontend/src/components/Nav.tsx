import { useState } from "react"
import { Link, NavLink } from "react-router-dom"

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
		{text: "Community", link: "/leaderboard"},
		{text: "Rules", link: "/rules"},
		{text: "About-us", link: "/about-us"}
	]

	return (
		<header>
			<nav className="nav">
				<Link to='/'>
					<p>LOGO</p>
					{/* <img src={ LogoPong } alt="Logo PingPong" /> */}
				</Link>

				{/* Navigation Menu */}
				<ul className='nav-menu'>
					{
						navItems.map(items => {
							return (
								<li className="nav-item">
									<NavLink to={ items.link } className="nav-link">
										<span className="nav-item_text">{ items.text }</span>
									</NavLink>
								</li>
							)
						})
					}
				</ul>
				<ProfilMenu />
			</nav>
		</header>
	);
}
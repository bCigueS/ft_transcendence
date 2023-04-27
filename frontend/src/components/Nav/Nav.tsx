import { Link, NavLink } from "react-router-dom"

import ProfilMenu from "./ProfilMenu"

interface navItem {
	text: string,
	link: string
}

const Nav: React.FC = () => {

	const navItems: navItem[] = [
		{text: "Home", link:"/"},
		{text: "PingPong", link:"/pong"},
		{text: "Community", link: "/leaderboard"},
		{text: "Rules", link: "/rules"},
		// {text: "About-us", link: "/about-us"}
	]

	return (
		<header>
			<nav className="nav">
				<Link to='/'>
					<p>LOGO</p>
				</Link>

				{/* Navigation Menu */}
				<ul className='nav-menu'>
					{
						navItems.map(items => {
							return (
								<li key={items.text} className="nav-item">
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

export default Nav;
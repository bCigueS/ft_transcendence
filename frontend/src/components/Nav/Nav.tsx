import { Link, NavLink } from "react-router-dom"
import classses from '../../sass/components/Nav/Nav.module.scss';


import ProfileMenu from "./ProfileMenu";

interface navItem {
	text: string,
	link: string
}

const Nav: React.FC = () => {

	const navItems: navItem[] = [
		{text: "Home", link:"/"},
		{text: "PingPong", link:"/pong"},
		{text: "Leaderbord", link: "/leaderboard"},
		{text: "Rules", link: "/rules"},
		// {text: "About-us", link: "/about-us"}
	]

	return (
		<header>
			<nav className={classses.nav}>
				<Link to='/'>
					<p>LOGO</p>
				</Link>

				{/* Navigation Menu */}
				<ul className={classses.menu}>
					{
						navItems.map(items => {
							return (
								<li key={items.text} className={classses.item}>
									<NavLink to={ items.link } className="nav-link">
										<span className="nav-item_text">{ items.text }</span>
									</NavLink>
								</li>
							)
						})
					}
				</ul>
				<ProfileMenu />
			</nav>
		</header>
	);
}

export default Nav;
import { Link, NavLink } from "react-router-dom"
import classes from '../../sass/components/Nav/Nav.module.scss';


import ProfileMenu from "./ProfileMenu";

interface navItem {
	text: string,
	link: string
}

const Nav: React.FC = () => {

	// const styleNav: React.CSSProperties = {
	// 	content: '',
	// 	opacity: 1,
	// 	bottom: '-0.8rem',
	// 	left: '-0.8rem',
	// }

	const navItems: navItem[] = [
		{text: "Home", link:"/"},
		{text: "PingPong", link:"/pong"},
		{text: "Chat", link: '/chat'},
		{text: "Leaderbord", link: "/leaderboard"}
		// {text: "Rules", link: "/rules"},
		// {text: "About-us", link: "/about-us"}
	]

	return (
		<header>
			<nav className={classes.nav}>
				<Link to='/'>
					<p>LOGO</p>
				</Link>

				{/* Navigation Menu */}
				<ul className={classes.menu}>
					{
						navItems.map(items => {
							return (
								<NavLink 
									to={ items.link } 
									key={items.text}
									// className={classes.item}
									className={({isActive}) => isActive ? classes.item + " " + classes.active : classes.item }
									>
									<span className="nav-item_text">{ items.text }</span>
								</NavLink>
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
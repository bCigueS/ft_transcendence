import { Link, NavLink, useRouteLoaderData } from "react-router-dom"
import classes from '../../sass/components/Nav/Nav.module.scss';


import ProfileMenu from "./ProfileMenu";
import { useContext, useEffect } from "react";
import { UserContext } from "../../store/users-contexte";

interface navItem {
	text: string,
	link: string
}

const Nav: React.FC = () => {

	const token: string = useRouteLoaderData('root') as string;

	const navItems: navItem[] = [
		{text: "Home", link:"/"},
		{text: "PingPong", link:"/pong"},
		{text: "Chat", link: '/chat'},
		{text: "Leaderbord", link: "/leaderboard"},
	]
	
	return (
		<header>
			<nav className={classes.nav}>
				<Link to='/'>
					<p>LOGO</p>
				</Link>
					<ul className={classes.menu}>
					{ token ? 
						navItems.map(items => {
							return (
								<NavLink 
								to={ items.link } 
								key={items.text}
								className={
									({isActive}) => isActive 
									? classes.item + " " + classes.active 
									: classes.item }
								>
									<span className="nav-item_text">{ items.text }</span>
								</NavLink>
							)
						})
						: <NavLink to="/auth" className={({isActive}) => isActive ? classes.item + " " + classes.active : classes.item}>
								<span className="nav-item_text">Authentication</span>
						</NavLink>
					}
					</ul>
				<ProfileMenu />
			</nav>
		</header>
	);
}

export default Nav;
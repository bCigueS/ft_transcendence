import { Link, NavLink, useRouteLoaderData } from "react-router-dom"
import classes from '../../sass/components/Nav/Nav.module.scss';
import LogoPong from '../../assets/logo/pong2.svg';
import ProfileMenu from "./ProfileMenu";

interface navItem {
	text: string,
	link: string
}

const Nav: React.FC = () => {

	const token: string = useRouteLoaderData('root') as string;

	const navItems: navItem[] = [
		{text: "PingPong", link:"/pong"},
		{text: "Chat", link: '/chat'},
		{text: "Leaderbord", link: "/leaderboard"},
	]
	
	return (
		<header>
			<nav className={classes.nav}>
				<Link to='/'>
					<img src={LogoPong} alt="LogoPong" />
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
				
				{ token &&
					<ProfileMenu />
				}
			</nav>
		</header>
	);
}

export default Nav;
import { useContext } from 'react';
import LiveGame from '../components/Game/LiveGame';
import classes from '../sass/pages/Homepage.module.scss'
import { UserContext } from '../store/users-contexte';


const Homepage: React.FC = () => {

	const userCtx = useContext(UserContext);

	// userCtx.fetchUser();
	return (
		<div className={classes.main}>
			<div className={classes.rules}>
				<h1>Rules of the Game</h1>
				<div className={classes.info}>
					<div className={classes.level}>
						<h2>Choose your level</h2>
						<p>Choose the <span>difficulty level</span>, between one to 3, to change the <span>size</span> of the paddle and the <span>speed</span> of the game !</p>
					</div>

					<div className={classes.control}>
						<h2>Choose your control</h2>
						<p>Use <span>Placeholder</span> and <span>Placeholder</span> or your <span>Placeholder</span> to control the paddle!</p>

					</div>

					<div className={classes.play}>
						<h2>Play the Game</h2>
						<p>The first player to <span>11</span> win the game!</p>
					</div>
				</div>
			</div>
			<LiveGame/>
		</div>
	)
}

export default Homepage;
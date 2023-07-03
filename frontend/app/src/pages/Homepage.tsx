import LiveGame from '../components/Game/LiveGame';
import classes from '../sass/pages/Homepage.module.scss'


const Homepage: React.FC = () => {

	return (
		<div className={classes.main}>
			<div className={classes.rules}>
				<h1>Rules of the Game</h1>
				<div className={classes.info}>
					<div className={classes.level}>
						<h2>Choose your level</h2>
						<p>There are 3 difficulty levels, <span>easy, medium, hard</span>. The different levels will change <span>paddle size</span> and <span>ball speed</span> of the game!
						There is also a <span>special level</span> for your surprise!</p>
					</div>

					<div className={classes.control}>
						<h2>Choose your control</h2>
						<p>Play with either <span>mouse</span> or <span>keyboard</span> to control your paddle!
						If you choose <span>play with keyboard</span>, use <span>up</span> and <span>down arrows</span> to move.
						You can pause the game with <span>spacebar</span>.</p>

					</div>

					<div className={classes.play}>
						<h2>Play the Game</h2>
						<p>The first player to get <span>11</span> points, wins the game!</p>
					</div>
				</div>
			</div>
			<LiveGame/>1fr
		</div>
	)
}

export default Homepage;
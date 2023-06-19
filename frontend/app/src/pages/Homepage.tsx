import LiveGame from '../components/Game/LiveGame';
import classes from '../sass/pages/Homepage.module.scss'


const Homepage: React.FC = () => {
	return (
		<div className={classes.main}>
			<div className={classes.rules}>
				<h1>Rules of the Game</h1>
				<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore fugit cupiditate adipisci, velit placeat distinctio facere suscipit. Vel cupiditate et adipisci neque voluptas illum cum necessitatibus maiores quis. Alias, nam.</p>
			</div>
			<LiveGame/>
		</div>
	)
}

export default Homepage;
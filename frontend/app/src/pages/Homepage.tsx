import LiveGame from '../components/Game/LiveGame';
import classes from '../sass/pages/Homepage.module.scss'


const Homepage: React.FC = () => {
	return (
		<div className={classes.main}>
			<div className={classes.rules}>
				<h1>Rules of the Game</h1>
				<div className={classes.info}>
					<div>
						<h2>Choose your level!</h2>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum distinctio aliquid adipisci voluptatem perspiciatis saepe expedita libero? Nihil nulla earum molestias vel maiores voluptate tempore ipsum, quibusdam molestiae sunt. Maiores?</p>
					</div>

					<div>
						<h2>Choose your control!</h2>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum distinctio aliquid adipisci voluptatem perspiciatis saepe expedita libero? Nihil nulla earum molestias vel maiores voluptate tempore ipsum, quibusdam molestiae sunt. Maiores?</p>

					</div>

					<div>
						<h2>Play the Game!</h2>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum distinctio aliquid adipisci voluptatem perspiciatis saepe expedita libero? Nihil nulla earum molestias vel maiores voluptate tempore ipsum, quibusdam molestiae sunt. Maiores?</p>

					</div>
				</div>
			</div>
			<LiveGame/>
		</div>
	)
}

export default Homepage;
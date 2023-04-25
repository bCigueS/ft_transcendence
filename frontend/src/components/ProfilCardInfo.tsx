import '../sass/main.scss';

const ProfilCardInfo: React.FC = () => {
	return (
		<div className="profil-card">
			<div className="profil-card__picture"></div>
			<div className="profil-card__user">
				<h1>Sbeylot</h1>
				<p>Simon Beylot</p>
			</div>
			<div className="profil-card__stat">
				<div className='profil-card__stat__info'>
					<i className="fa-solid fa-trophy"></i>
					<p>0</p>
				</div>
				<div className='profil-card__stat__info'>
					<i className="fa-solid fa-bolt"></i>
					<p>0</p>
				</div>
				<div className='profil-card__stat__info'>
					<i className="fa-sharp fa-solid fa-chart-simple"></i>
					<p>0</p>
				</div>
			</div>
		</div>

	);
};

export default ProfilCardInfo;